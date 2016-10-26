'use strict'

var express = require('express')
var http = require('http')
var app = express()
var port = process.env.PORT || 3000
var server = http.createServer(app)
var io = require('socket.io')(server)
var connections = [];

// serve static files with express
app.use(express.static('./public'));

app.set('view engine', 'ejs');


app.get('/', function (req, res) {
  console.log("Rendering index.ejs")
  res.render('index');
});

app.get('/discuss/:id', function (req, res) {
  console.log("Rendering chatroom.ejs");

  console.log(req.query);
  res.render('chatroom', req.query );
});

// custom namespaces for each unique chatroom
// var nsp = io.of('/topic-id');
// nsp.on('connection', function(socket){
//   console.log('someone connected'):
// });
// nsp.emit('hi', 'everyone!');
// io.to('some room').emit('some event');
//
// io.on('connection', function(socket){
//   socket.join('some room');
// });

function findConnection (id) {
  return connections.filter(function (c) { return c.id === id })[0]
}
// start ther server listening
server.listen(port, () => {
  console.log('Server listening on port: ', server.address().port)
});

// listen for a socket io connection event
io.on('connection', (socket) => {
  // new connection, save the socket
  connections.push({id: socket.id})
  console.log(`## New connection (${socket.id}). Total: ${connections.length}.`)

  // listen for a disconnect event
  socket.once('disconnect', () => {
    // find the connection and remove  from the collection
    let connection = findConnection(socket.id)
    if (connection) {
      connections.splice(connections.indexOf(connection), 1)
      if (connection.user) {
        socket.broadcast.emit('left', connection.user)
        socket.broadcast.emit('online', connections)
        console.log(`## ${connection.user}(${connection.id}) disconnected. Remaining: ${connections.length}.`)
      } else {
        console.log(`## Connection (${connection.id}) (${socket.id}) disconnected. Remaining: ${connections.length}.`)
      }
    }
    socket.disconnect()
  })

  // listen for a chat message from a socket and broadcast it
  socket.on('join', (username) => {
    // attach the new user to the connection object
    let connection = findConnection(socket.id)
    connection.user = username
    // emit welcome message to new user
    socket.emit('connect');
    // broadcast their arrival to everyone else
    socket.broadcast.emit('newcomer', username)
    io.sockets.emit('online', connections)

    console.log(`## ${connection.user} joined the chat on (${connection.id}).`)
  })

  // broadcast chat message to other users
  socket.on('chat', (msg) => {
    let connection = findConnection(socket.id)
    // broadcast to other users
    socket.broadcast.emit('chat', {message: msg, user: connection.user})

    console.log(`## ${connection.user} said: ${msg}`);
  })
})
