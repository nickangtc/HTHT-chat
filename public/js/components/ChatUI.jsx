const ChatUI = React.createClass({
  getInitialState: function () {
    return {
      username: '',
      users: [],
      formIsDisabled: true,
      socketConnected: false,
      socket: '',
      message: '',
      messages: [
        {
          name: 'alex',
          msg: 'hey everyone'
        },
        {
          name: 'joanna',
          msg: 'Hey Alex! So, what do you think about the topic at hand?'
        }
      ]
    }
  },
  initSocketListeners: function (socket) {
    socket.on('chat', this.messageRecieve);
    socket.on('newcomer', this.userJoined);
    socket.on('left', this.userLeft);
  },
  messageRecieve: function (msg) {
    var messages = this.state.messages;
    messages.unshift({
      name: msg.user,
      msg: msg.message
    });
    this.setState({ messages: messages });
  },
  userJoined: function (user) {
    var users = this.state.users;
    var messages = this.state.messages;
    users.unshift(user);
    messages.unshift({
      name: '',
      msg: user + ' joined'
    });
    this.setState({ users: users });
  },
  userLeft: function (user) {
    var users = this.state.users;
    var messages = this.state.messages;
    users.splice(users.indexOf(user), 1);
    messages.unshift({
      name: '',
      msg: user + ' left'
    });
    this.setState({
      users: users,
      messages: messages
    });
  },
  handleMsgInput: function (e) {
    this.setState({ message: e.target.value });
  },
  sendMsg: function (e) {
    e.preventDefault();

    var msg = this.state.message;
    var socket = this.state.socket;
    socket.emit('chat', msg);

    var messages = this.state.messages;
    messages.unshift({
      name: 'you',
      msg: msg
    });
    this.setState({
      messages: messages,
      message: ''
    });
  },
  updateDOM: function (data) {
    console.log(data);
    $('#inputField').empty();
  },
  handleNameInput: function (e) {
    this.setState({ username: e.target.value });
  },
  connectSocket: function (e) {
    e.preventDefault();

    var socket = io(window.location.host);
    this.setState({
      socketConnected: true,
      socket: socket
    });
    this.initSocketListeners(socket);

    console.log('Joining chat with name: ', this.state.username)
    socket.emit('join', this.state.username);

    // handle connectting to and disconnecting from the chat server
    socket.on('connect', function () {
      console.log('Connected to Chat Socket')
    });
    socket.on('disconnect', function () {
      console.log('Disconnected from Chat Socket')
    });
  },

  render: function () {
    if (this.state.messages) {
      var allMessages = this.state.messages.map(function (msg, ind) {
        return (
          <ChatMessage key={ind} msg={msg} />
        )
      });
    }

    if (this.state.socketConnected) {
      return (
        <div>

          <div className="row">
            <div className="col-md-offset-2"></div>
            <div className="col-md-8">
              <form className="form-inline">
                <input id="inputField" type="text" placeholder="type a message" onChange={this.handleMsgInput} className="form-control" />
                <button onClick={this.sendMsg} className="btn btn-success">Send</button>
              </form>
            </div>
            <div className="col-md-offset-2"></div>
          </div>

          <div className="row">
            {allMessages}
          </div>

        </div>
      );
    } else if (!this.state.socketConnected){
      return (
        <div className="row">
          <div className="col-md-offset-2"></div>
          <div className="col-md-8">
            <form className="form-inline">
              <input id="inputField" type="text" placeholder="pick a username" onChange={this.handleNameInput} className="form-control" />
              <button onClick={this.connectSocket} className="btn btn-success"> Join </button>
            </form>
          </div>
          <div className="col-md-offset-2"></div>
        </div>
      )
    }
  }
});
