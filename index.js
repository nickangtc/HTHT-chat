'use strict';

const express = require('express');
const db = require('./models');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = require('socket.io')(server);

// Logs all existing socket connections where 1 user is has 1 connection
// [ {id, user, chatroomID}, {}, ... ]
// var CONNECTIONS = [];
const CONNECTIONS = allConnections() || [];

// currently existing topics and their corresponding chatrooms
const TOPICS = [
  {
    id: 1,
    title: 'will we see AI in our lifetime?',
    headCount: 2
  },
  {
    id: 2,
    title: 'the maddest US presidential elections ever',
    headCount: 1
  },
  {
    id: 3,
    title: 'the beauty of trees in cities',
    headCount: 3
  }
];

// SERVER CONFIG
app.use(express.static('./public'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// SERVER ROUTES
app.get('/', function (req, res) {
  console.log("Rendering index.ejs")
  res.render('index');
});

app.get('/discuss/:id', function (req, res) {
  console.log("Rendering chatroom.ejs");

  console.log(req.query);
  res.render('chatroom', req.query );
});

app.get('/topics', function (req, res) {
  console.log("Dispatching topics from server GET TOPICS");
  db.chatroom_topic.findAll().then(function (topics) {
    res.send(topics);
  });
});

// Create new chatroom topic
app.post('/topics', function (req, res) {
  console.log("Received topic from front-end...");
  console.log("req.body", req.body);
  const newTopic = req.body;

  db.chatroom_topic.findOrCreate({
    where: {
      title: newTopic.title
    },
    defaults: { active_users: 1 }
  }).then(function (topic, created) {
    // At the moment, no differentiation between creating and joining existing room
    const redirectPath = 'discuss/' + topic[0].dataValues.id + '?topic=' + encodeURIComponent(req.body.title);
    console.log('Redirecting to', '/discuss/' + topic[0].dataValues.id + '?topic=' + req.body.title);
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
  })
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
  // CONNECTIONS.push({id: socket.id})
  console.log("Creating new connection.");
  db.connections.create({
    socketID: socket.id
  });

  console.log(`\n## New connection (${socket.id}).`)

  // find or create chatroom
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
      // console.log("connection object returned after update:", newConnection[1].dataValues);
      const connection = newConnection[1].dataValues;

      // emit welcome message to new user
      socket.emit('connected', connection);

      // broadcast their arrival to everyone else
      getActiveConnections(data.chatroomID, (activeConnections) => {
        console.log('\n\nactiveConnections:');
        console.log(activeConnections);
        io.to(connection.chatroomID).emit('newcomer', data.username);
        io.to(connection.chatroomID).emit('online', activeConnections);
        console.log(`## ${connection.user} joined the chatroom (${connection.chatroomID}).`)
      });
    });
  });

  // listen for a disconnect event
  socket.once('disconnect', () => {
    // find the connection and remove  from the collection
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

        getActiveConnections(deleted.chatroomID, (activeConnections) => {
          io.to(deleted.chatroomID).emit('left', deleted.user);
          io.to(deleted.chatroomID).emit('online', activeConnections);

          console.log(`## ${deleted.user}(${deleted.id}) disconnected. Remaining: ${activeConnections.length}.`)
        });
      })
    });
    socket.disconnect();
  });

  // broadcast chat message to other users
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
