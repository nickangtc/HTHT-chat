'use strict'

var express = require('express')
var http = require('http')
var app = express()
var port = process.env.PORT || 3000
var server = http.createServer(app)
var io = require('socket.io')(server)
var connections = [];

// SERVER CONFIG
app.use(express.static('./public'));
app.set('view engine', 'ejs');

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


// SOCKET.IO
function findConnection (id) {
  console.log('connections:', connections);
  return connections.filter(function (c) { return c.id === id })[0]
}
// start server listening
server.listen(port, () => {
  console.log('Server listening on port: ', server.address().port)
});


// custom namespaces for each unique chatroom
// var channel1 = io.of('/channelid');
// channel1.on('connection', function(socket){
//   console.log('someone connected'):
// });
// channel1.emit('hi', 'everyone!');



// listen for a socket io connection event
io.on('connection', (socket) => {
  // new connection, save the socket
  connections.push({id: socket.id})
  console.log(`## New connection (${socket.id}). Total: ${connections.length}.`)

  // find or create chatroom
  socket.on('join or create room', function (data) {

    socket.join(data.chatroomID);

    // attach the new user and her chatroomID to the connection object
    let connection = findConnection(socket.id)
    connection.user = data.username;
    connection.chatroomID = data.chatroomID;
    // emit welcome message to new user
    socket.emit('connected');
    // broadcast their arrival to everyone else
    io.to(data.chatroomID).emit('newcomer', data.username);
    socket.broadcast.to(data.chatroomID).emit('online', connections);


    io.to(data.chatroomID).emit('some event');

    console.log(`## ${connection.user} joined the chat on (${connection.id}).`)
  });

  // // listen for a chat message from a socket and broadcast it
  // socket.on('join', (data) => {
  //   // attach the new user to the connection object
  //   let connection = findConnection(socket.id)
  //   connection.user = data.username;
  //   // emit welcome message to new user
  //   socket.emit('connect');
  //   // broadcast their arrival to everyone else
  //   socket.broadcast.to(connection).emit('newcomer', data.username)
  //   io.sockets.emit('online', connections)
  //
  //   console.log(`## ${connection.user} joined the chat on (${connection.id}).`)
  // });

  // listen for a disconnect event
  socket.once('disconnect', () => {
    // find the connection and remove  from the collection
    let connection = findConnection(socket.id)
    if (connection) {
      connections.splice(connections.indexOf(connection), 1)
      if (connection.user) {
        socket.broadcast.to(connection).emit('left', connection.user)
        socket.broadcast.to(connection).emit('online', connections)
        console.log(`## ${connection.user}(${connection.id}) disconnected. Remaining: ${connections.length}.`)
      } else {
        console.log(`## Connection (${connection.id}) (${socket.id}) disconnected. Remaining: ${connections.length}.`)
      }
    }
    socket.disconnect()
  });

  // broadcast chat message to other users
  socket.on('chat', (msg) => {
    let connection = findConnection(socket.id)
    // broadcast to other users
    socket.broadcast.to(connection.chatroomID).emit('chat', {message: msg, user: connection.user})

    console.log(`## ${connection.user} said: ${msg}`);
  })
})
