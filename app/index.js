const express = require('express');
const path = require('path');
const http = require('http');
const db = require('./models');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');

const { permanentTopics } = require('./data/permanent-topics.js');
const dbHelper = require('./util/db-helpers.js');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIO(server);


/**
 * ================================
 * Config
 * ================================
 */
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true,
}));

/**
 * ================================
 * Routes
 * ================================
 */
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/discuss/:id', (req, res) => {
  db.chatroom_topic.findOne({
    where: { id: req.params.id },
    raw: true,
  }).then((chatroom) => {
    res.render('chatroom', chatroom);
  });
});

app.get('/topics', (req, res) => {
  db.chatroom_topic.findAll({
    attributes: ['title', 'active_users'],
    raw: true,
  }).then((topics) => {
    res.send(topics.concat(permanentTopics));
  });
});

app.post('/topics', (req, res) => {
  const newTopic = req.body;

  db.chatroom_topic.findOrCreate({
    where: { title: newTopic.title },
    defaults: { active_users: 0 },
    raw: true,
  }).spread((topic) => {
    const redirectPath = `discuss/${topic.id}?topic=${encodeURIComponent(topic.title)}`;
    res.send(redirectPath);
  });
});

// start server listening
server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('Server listening on port: ', server.address().port);
});

/**
 * ================================
 * Web socket (socket.io)
 * Event handlers
 * ================================
 */
// listen for a socket io connection event
io.on('connection', (socket) => {
  // new connection, save the socket
  db.connections.create({
    socketID: socket.id,
  });

  // eslint-disable-next-line no-console
  console.log(`\n## New connection (${socket.id}).`);

  // listen for "join or create room" event
  socket.on('join or create room', (data) => {
    socket.join(data.chatroomID);

    // attach the new user and her chatroomID to the connection object
    db.connections.update({
      user: data.username,
      chatroomID: data.chatroomID,
    }, {
      where: { socketID: socket.id },
      returning: true,
      plain: true,
    }).then((newConnection) => {
      const connection = newConnection[1].dataValues;

      // broadcast their arrival to everyone else
      dbHelper.getActiveConnections(data.chatroomID, (activeConnections) => {
        io.to(connection.chatroomID).emit('newcomer', data.username);
        io.to(connection.chatroomID).emit('online', activeConnections);
        // eslint-disable-next-line no-console
        console.log(`## ${connection.user} joined the chatroom (${connection.chatroomID}).`);
      });

      db.chatroom_topic.findOne({
        where: { id: connection.chatroomID },
      }).then((chatroom) => {
        // reassignment is intended with Sequelize instance
        // eslint-disable-next-line no-param-reassign
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
      where: { socketID: socket.id },
    }).then((connection) => {
      // clone deleted instance for use later after deletion
      deleted = Object.assign({}, connection.dataValues);

      // ensure connection is deleted from DB before returning response
      db.connections.destroy({
        where: { socketID: socket.id },
      }).then(() => {
        db.chatroom_topic.findOne({
          where: { id: deleted.chatroomID },
        }).then((chatroom) => {
          chatroom.active_users -= 1; // eslint-disable-line no-param-reassign
          chatroom.save();
        });

        dbHelper.getActiveConnections(deleted.chatroomID, (activeConnections) => {
          // broadcast who left and current active users
          io.to(deleted.chatroomID).emit('left', deleted.user);
          io.to(deleted.chatroomID).emit('online', activeConnections);

          // delete the chatroom if last user has left
          if (activeConnections.length === 0) {
            db.chatroom_topic.destroy({ where: { id: deleted.chatroomID } });
          }
          // eslint-disable-next-line no-console
          console.log(`## ${deleted.user}(${deleted.id}) disconnected.\
            Connections remaining: ${activeConnections.length}.`);
        });
      });
    });
    socket.disconnect();
  });

  // listen for "chat" event
  socket.on('chat', (msg) => {
    db.connections.findOne({
      where: { socketID: socket.id },
    }).then((connection) => {
      // broadcast to other users
      socket.broadcast.to(connection.chatroomID).emit('chat', { message: msg, user: connection.user });
    });
  });
});
