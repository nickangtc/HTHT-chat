/* global io, active_users */
// global 'io' via CDN script, 'active_users' via EJS view
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import OnlineStatusWidget from './widget-online-status.jsx';
import { autoScroll } from '../util/ui';


const ChatBubble = (props) => {
  let panelClass = 'panel-default';
  if (props.message.name === 'me') panelClass = 'panel-primary';

  return (
    <div className="row chat-bubble">
      <div className="col-md-12">
        <div className={`panel ${panelClass}`}>
          <div className="panel-body">
            { props.message.name !== 'me' &&
              <small>{props.message.name}</small>
            }
            <p>{props.message.msg}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
ChatBubble.propTypes = {
  message: PropTypes.shape({
    msg: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

export default class ChatApp extends Component {
  constructor(props) {
    super(props);

    // username colors
    this.colors = ['#3AE8B0', '#19AFD0', '#6967CE', '#FFB900', '#FD636B'];

    this.state = {
      chatroomID: '',
      username: '',
      users: [],
      formIsDisabled: true,
      socketConnected: false,
      socket: '',
      message: '',
      messages: [],
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
  }

  componentWillMount() {
    // get page id from url
    const url = window.location.pathname.toString();
    const startSliceIndex = url.indexOf('/', 1) + 1;
    const id = url.slice(startSliceIndex);
    this.setState({ chatroomID: id });

    // on any keypress, autofocus to input field
    $(document).on('keypress', () => {
      $('#inputField').focus();
    });
  }

  initSocketListeners(socket) {
    socket.on('chat', this.messageRecieve);
    socket.on('newcomer', this.userJoined);
    socket.on('left', this.userLeft);
    socket.on('online', this.updateOnlineWidget);
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
        { name: '', msg: `${user} joined` },
      ],
    });
  }

  userLeft(user) {
    this.setState({
      messages: [
        ...this.state.messages,
        { name: '', msg: `${user} left` },
      ],
    });
  }

  handleMsgInput(e) {
    this.setState({ message: e.target.value });
  }

  sendMsg(e) {
    e.preventDefault();
    const { socket, message } = this.state;

    // ignore empty chat message submissions
    if (message === '') return;

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
    const {
      username,
      chatroomID,
    } = this.state;

    if (username === '') return;

    // create socket connection to server
    const socket = io(window.location.host);

    // init socket on client to listen for and emit events
    this.setState({
      socket,
      socketConnected: true,
      currentUser: this.state.username,
    });
    this.initSocketListeners(socket);

    // emit "join or create room" event
    socket.emit('join or create room', {
      username,
      chatroomID,
    });
  }

  updateOnlineWidget(activeConnections) {
    const users = activeConnections.map(conn => conn.user);
    this.setState({ users });
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
      allMessages = messages.map((msg, ind) => <ChatBubble key={ind} message={msg} />);
      setTimeout(() => autoScroll('messages'), 30);
    }

    // socket connected
    if (socketConnected) {
      return (
        <div className="padding-bottom">
          <div className="container">
            <div className="row">
              <OnlineStatusWidget users={users} currentUser={currentUser} colors={this.colors} />
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
                <div className="col-md-8 col-centered">
                  <form onSubmit={this.sendMsg}>
                    <input
                      id="inputField" type="text" placeholder="type a message"
                      className="form-control input-lg"
                      onChange={this.handleMsgInput} autoComplete='off' />
                    <button type="submit" className="btn btn-success btn-lg hidden">Send</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // socket not connected yet
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-centered text-center">
            { active_users >= 5 && // eslint-disable-line camelcase
              <p className="text-danger">
                This room seems pretty popular. Join another room?
                <br/>
                Alternatively, create a new room with a slightly different title.
              </p>
            }
            { active_users < 5 && // eslint-disable-line camelcase
              <form className="form-inline" onSubmit={this.connectToSocket}>
                <input id="inputField" type="text" placeholder="pick a username"
                  className="form-control"
                  onChange={this.handleNameInput} autoComplete='off' />
                <button type="submit" className="hidden"> Join </button>
              </form>
            }
          </div>
        </div>
      </div>
    );
  }
}
