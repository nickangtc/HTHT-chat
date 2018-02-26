// TODO: updateOnlineWidget and render <WhosOnlineWidget />
import React, { Component } from 'react';

import WhosOnlineWidget from './WhosOnlineWidget.jsx';


const ChatMessage = (props) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="panel panel-default">
          <div className="panel-body">
            <small>{props.msg.name}</small>
            <p>{props.msg.msg}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default class IndexPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatroomID: '',
      username: '',
      users: [],
      formIsDisabled: true,
      socketConnected: false,
      socket: '',
      message: '',
      messages: []
    };

    // Bindings
    this.initSocketListeners = this.initSocketListeners.bind(this);
    this.messageRecieve = this.messageRecieve.bind(this);
    this.userJoined = this.userJoined.bind(this);
    this.userLeft = this.userLeft.bind(this);
    this.handleMsgInput = this.handleMsgInput.bind(this);
    this.sendMsg = this.sendMsg.bind(this);
    this.handleNameInput = this.handleNameInput.bind(this);
    this.connectToSocket = this.connectToSocket.bind(this);
    this.updateOnlineWidget = this.updateOnlineWidget.bind(this);
    this.autoScroll = this.autoScroll.bind(this);
  }

  componentWillMount() {
    // get page id from url
    const url = window.location.pathname.toString();
    const startSliceIndex = url.indexOf('/', 1) + 1;
    const id = url.slice(startSliceIndex);
    this.setState({ chatroomID: id });

    // on any keypress, autofocus to input field
    $(document).on("keypress", function() {
      $("#inputField").focus();
    });
  }

  initSocketListeners(socket) {
    socket.on('chat', this.messageRecieve);
    socket.on('newcomer', this.userJoined);
    socket.on('left', this.userLeft);
    socket.on('online', this.updateOnlineWidget);
    socket.on('connected', function () { console.log('Connected to Chat Socket') });
    socket.on('disconnect', function () { console.log('Disconnected from Chat Socket') });
  }

  messageRecieve(msg) {
    this.setState({
      messages: [
        ...this.state.messages,
        { name: msg.user, msg: msg.message },
      ],
    });
  }

  userJoined(user) {
    this.setState({
      messages: [
        ...this.state.messages,
        { name: '', msg: user + ' joined' },
      ],
    });
  }

  userLeft(user) {
    this.setState({
      messages: [
        ...this.state.messages,
        { name: '', msg: user + ' left' },
      ],
    });
  }

  handleMsgInput(e) {
    this.setState({ message: e.target.value });
  }

  sendMsg(e) {
    e.preventDefault();

    const { socket, message } = this.state;
    socket.emit('chat', message);

    this.setState({
      messages: [
        ...this.state.messages,
        { name: 'me', msg: message },
      ],
      message: '',
    });

    $('#inputField').val('');
  }

  handleNameInput(e) {
    this.setState({ username: e.target.value });
  }

  connectToSocket(e) {
    e.preventDefault();

    const socket = io(window.location.host);

    // init socket on client to listen for and emit events
    this.setState({
      socketConnected: true,
      socket: socket,
      currentUser: this.state.username,
    });
    this.initSocketListeners(socket);

    console.log('Joining chatroom', this.state.chatroomID, 'with name: ', this.state.username)

    // emit "join or create room" event
    socket.emit('join or create room', {
      username: this.state.username,
      chatroomID: this.state.chatroomID
    });
  }

  updateOnlineWidget(activeConnections) {
    const users = activeConnections.map(conn => conn.user);
    this.setState({ users: users });
  }

  autoScroll() {
    const messagesDiv = $('#messages');
    if (messagesDiv) {
      messagesDiv.stop().animate({
        scrollTop: messagesDiv[0].scrollHeight
      }, 1500);
    }
  }

  render() {
    const {
      socketConnected,
      messages,
      users,
      currentUser,
    } = this.state;
    let allMessages = null;

    if (socketConnected && messages) {
      allMessages = messages.map(function (msg, ind) {
        return (
          <ChatMessage key={ind} msg={msg} />
        )
      });
      setTimeout(this.autoScroll, 30);
    }
    if (socketConnected) {
      return (
        <div className="padding-bottom">
          <div className="container">
            <div className="row">
              <WhosOnlineWidget users={users} currentUser={currentUser} />
            </div>
            <div className="row">
              <div id="messages" className="col-md-8 col-centered">
                {allMessages}
              </div>
            </div>
          </div>
          <div className="navbar navbar-fixed-bottom">
            <div className="container">
              <div className="row">
                <div className="col-md-8 col-centered text-center">
                  <form onSubmit={this.sendMsg}>
                    <input id="inputField" type="text" placeholder="type a message" onChange={this.handleMsgInput} className="form-control input-lg" autoComplete='off' />
                    <button type="submit" className="btn btn-success btn-lg hidden">Send</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (!socketConnected){
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-centered text-center">
              <form className="form-inline" onSubmit={this.connectToSocket}>
                <input id="inputField" type="text" placeholder="pick a username" onChange={this.handleNameInput} className="form-control" autoComplete='off' />
                <button type="submit" className="hidden"> Join </button>
              </form>
            </div>
          </div>
        </div>
      )
    }
  }
}
