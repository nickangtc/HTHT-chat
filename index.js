'use strict'

var express = require('express');
var db = require('./models');
var http = require('http');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var server = http.createServer(app);
var io = require('socket.io')(server);

// Logs all existing socket connections where 1 user is has 1 connection
// [ {id, user, chatroomID}, {}, ... ]
// var CONNECTIONS = [];
var CONNECTIONS = allConnections() || [];

// currently existing topics and their corresponding chatrooms
var TOPICS = [
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
  console.log("Received topic from front-end");
  var newTopic = req.body;

  db.chatroom_topic.findOrCreate({
    where: {
      title: newTopic.title
    },
    defaults: { active_users: 1 }
  }).then(function (topic, created) {
    // At the moment, no differentiation between creating and joining existing room
    var redirectPath = 'discuss/' + topic.id + '?topic=' + encodeURIComponent(req.body.title);
    console.log('Redirecting to', '/discuss/' + newTopic.id + '?topic=' + req.body.title);
    res.send(redirectPath);
  });
});


// SOCKET.IO
function findConnection (id) {
  console.log('connections:', CONNECTIONS);

  db.connections.findById(id).then(function (connection) {
    return connection;
    // return CONNECTIONS.filter(function (c) { return c.id === id })[0]
  });
}

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

// start server listening
server.listen(port, () => {
  console.log('Server listening on port: ', server.address().port)
});

// listen for a socket io connection event
io.on('connection', (socket) => {
  // new connection, save the socket
  // CONNECTIONS.push({id: socket.id})
  db.connections.create({
    socketID: socket.id
  });

  console.log(`## New connection (${socket.id}). Total: ${CONNECTIONS.length}.`)

  // find or create chatroom
  socket.on('join or create room', function (data) {

    socket.join(data.chatroomID);

    // attach the new user and her chatroomID to the connection object
    db.connections.update({
      user: data.username,
      chatroomID: data.chatroomID
    }, {
      where: { socketID: socket.id }
    });
    // emit welcome message to new user
    socket.emit('connected');
    // broadcast their arrival to everyone else
    let connection = findConnection(socket.id)
    io.to(connection.chatroomID).emit('newcomer', data.username);
    socket.broadcast.to(connection.chatroomID).emit('online', CONNECTIONS);

    io.to(connection.chatroomID).emit('some event');

    console.log(`## ${connection.user} joined the chat on (${connection.id}).`)
  });

  // listen for a disconnect event
  socket.once('disconnect', () => {
    // find the connection and remove  from the collection
    let connection = findConnection(socket.id)
    if (connection) {
      // Ensure connection is deleted from DB before proceeding
      if ( deleteConnection(socket.id) ) {
        if (connection.user) {
          socket.broadcast.to(connection.chatroomID).emit('left', connection.user)
          socket.broadcast.to(connection.chatroomID).emit('online', CONNECTIONS)
          console.log(`## ${connection.user}(${connection.id}) disconnected. Remaining: ${CONNECTIONS.length}.`)
        } else {
          console.log(`## Connection (${connection.id}) (${socket.id}) disconnected. Remaining: ${CONNECTIONS.length}.`)
        }
      }
    }
    // CONNECTIONS.splice(CONNECTIONS.indexOf(connection), 1)
    socket.disconnect();
  });

  // broadcast chat message to other users
  socket.on('chat', (msg) => {
    let connection = findConnection(socket.id)
    // broadcast to other users
    socket.broadcast.to(connection.chatroomID).emit('chat', {message: msg, user: connection.user})

    console.log(`## ${connection.user} said: ${msg}`);
  })
})
