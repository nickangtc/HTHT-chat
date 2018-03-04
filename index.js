'use strict';

const express = require('express');
const db = require('./models');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = require('socket.io')(server);

const { getRandomInt } = require('./public/js/util/math.js');
const { permanentTopics } = require('./public/js/data/permanent-topics.js');

// SERVER CONFIG
app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// SERVER ROUTES
app.get('/', function (req, res) {
  res.render('index');
});

app.get('/discuss/:id', function (req, res) {
  db.chatroom_topic.findOne({
    where: { id: req.params.id },
    raw: true,
  }).then((chatroom) => {
    res.render('chatroom', chatroom);
  });
});

app.get('/topics', function (req, res) {
  db.chatroom_topic.findAll({
    attributes: [ 'title', 'active_users' ],
    raw: true,
  }).then(function (topics) {
    res.send(topics.concat(permanentTopics));
  });
});

// Create new chatroom topic
app.post('/topics', function (req, res) {
  const newTopic = req.body;

  db.chatroom_topic.findOrCreate({
    where: {
      title: newTopic.title,
    },
    defaults: {
      active_users: 0,
    },
    raw: true,
  }).spread(function (topic, created) {
    // construct redirect url and send response
    const redirectPath = 'discuss/' + topic.id + '?topic=' + encodeURIComponent(topic.title);
    console.log('Redirecting to', redirectPath);
    res.send(redirectPath);
  });
});


// SOCKET.IO

function allConnections () {
  db.connections.findAll().then(function (connections) {
    return connections;
  });
}

function deleteConnection (id) {
  db.connections.destroy({
    where: { socketID: id }
  }).then(function () {
    console.log(`Connection ${id} deleted from db`);
    return true;
  });
}

function getActiveConnections(roomId, done) {
  db.connections.findAll({
    where: { chatroomID: roomId }
  }).then(function (connections) {
    const activeConnections = connections.map(conn => conn.dataValues);
    done(activeConnections);
  });
}

// start server listening
server.listen(port, () => {
  console.log('Server listening on port: ', server.address().port)
});

// listen for a socket io connection event
io.on('connection', (socket) => {
  // new connection, save the socket
  console.log("Creating new connection.");
  db.connections.create({
    socketID: socket.id
  });

  console.log(`\n## New connection (${socket.id}).`)

  // listen for "join or create room" event
  socket.on('join or create room', function (data) {
    socket.join(data.chatroomID);

    // attach the new user and her chatroomID to the connection object
    db.connections.update({
      user: data.username,
      chatroomID: data.chatroomID
    }, {
      where: { socketID: socket.id },
      returning: true,
      plain: true
    }).then(function (newConnection) {
      const connection = newConnection[1].dataValues;

      // emit welcome message to new user
      socket.emit('connected', connection);

      // broadcast their arrival to everyone else
      getActiveConnections(data.chatroomID, (activeConnections) => {
        io.to(connection.chatroomID).emit('newcomer', data.username);
        io.to(connection.chatroomID).emit('online', activeConnections);
        console.log(`## ${connection.user} joined the chatroom (${connection.chatroomID}).`)
      });

      db.chatroom_topic.findOne({
        where: { id: connection.chatroomID },
      }).then(function (chatroom) {
        chatroom.active_users += 1;
        chatroom.save();
      });
    });
  });

  // listen for "disconnect" event
  socket.once('disconnect', () => {
    // find the connection and remove from the collection
    let deleted = null;

    db.connections.findOne({
      where: { socketID: socket.id }
    }).then(function (connection) {
      // clone deleted instance for use later after deletion
      deleted = Object.assign({}, connection.dataValues);

      // ensure connection is deleted from DB before returning response
      db.connections.destroy({
        where: { socketID: socket.id }
      }).then(function () {
        console.log(`Connection ${socket.id} deleted from db`);

        db.chatroom_topic.findOne({
          where: { id: deleted.chatroomID },
        }).then(function (chatroom) {
          chatroom.active_users -= 1;
          chatroom.save();
        });

        getActiveConnections(deleted.chatroomID, (activeConnections) => {
          // broadcast who left and current active users
          io.to(deleted.chatroomID).emit('left', deleted.user);
          io.to(deleted.chatroomID).emit('online', activeConnections);

          // delete the chatroom if last user has left
          if (activeConnections.length === 0) {
            db.chatroom_topic.destroy({ where: { id: deleted.chatroomID } });
          }
          console.log(`## ${deleted.user}(${deleted.id}) disconnected. Remaining: ${activeConnections.length}.`)
        });
      })
    });
    socket.disconnect();
  });

  // listen for "chat" event
  socket.on('chat', (msg) => {
    db.connections.findOne({
      where: { socketID: socket.id }
    }).then(function (connection) {
      // broadcast to other users
      socket.broadcast.to(connection.chatroomID).emit('chat', { message: msg, user: connection.user });
      console.log(`## ${connection.user} said: ${msg}`);
    });
  });
})
