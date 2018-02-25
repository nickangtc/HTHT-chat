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
      users: [
        user,
        ...this.state.users,
      ],
      messages: [
        ...this.state.messages,
        {name: '', msg: user + ' joined'},
      ],
    });
  }

  userLeft(user) {
    let users = [...this.state.users];
    users.splice(users.indexOf(user), 1);

    this.setState({
      users: users,
      messages: [
        ...this.state.messages,
        {name: '', msg: user + ' left'},
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
        {name: 'you', msg: message},
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

    // connect to chat socket with chatroomID
    const socket = io(window.location.host);
    this.setState({
      socketConnected: true,
      socket: socket
    });
    this.initSocketListeners(socket);

    console.log('Joining chatroom', this.state.chatroomID, 'with name: ', this.state.username)
    socket.emit('join or create room', {
      username: this.state.username,
      chatroomID: this.state.chatroomID
    });
  }

  updateOnlineWidget(connections) {
    const users = [];
    for (var i = 0; i < connections.length; i++) {
      if (connections[i].id === this.state.chatroomID) {
        users.push(connections[i]['user']);
      }
    }
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
    let allMessages = null;

    if (this.state.socketConnected && this.state.messages) {
      allMessages = this.state.messages.map(function (msg, ind) {
        return (
          <ChatMessage key={ind} msg={msg} />
        )
      });
      setTimeout(this.autoScroll, 30);
    }
    if (this.state.socketConnected) {
      return (
        <div className="padding-bottom">
          <div className="container">
            <div className="row">
              <div id="messages" className="col-md-8 col-centered">
                {allMessages}
              </div>
              <div className="col-md-2">
                <WhosOnlineWidget users={this.state.users} />
              </div>
            </div>
          </div>

          <div className="navbar navbar-fixed-bottom">
            <div className="container">
              <div className="row">
                <div className="col-md-8 col-centered text-center">
                  <form>
                    <input id="inputField" type="text" placeholder="type a message" onSubmit={this.sendMsg} onChange={this.handleMsgInput} className="form-control input-lg" autoComplete='off' />
                    <button onClick={this.sendMsg} className="btn btn-success btn-lg hidden">Send</button>
                  </form>
                </div>
              </div>

            </div>
          </div>

        </div>

      );
    } else if (!this.state.socketConnected){
      return (
        <div className="container">
          <div className="row">
            <div className="col-md-8 col-centered text-center">
              <form className="form-inline">
                <input id="inputField" type="text" placeholder="pick a username" onChange={this.handleNameInput} className="form-control" autoComplete='off' />
                <button onClick={this.connectToSocket} className="btn btn-primary"> Join </button>
              </form>
            </div>
          </div>
        </div>
      )
    }
  }
}
