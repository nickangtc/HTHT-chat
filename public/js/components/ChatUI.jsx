const ChatUI = React.createClass({
  getInitialState: function () {
    return {
      chatroomID: '',
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
  componentWillMount: function () {
    // get page id from url
    var url = window.location.pathname.toString();
    var startSliceIndex = url.indexOf('/', 1) + 1;
    var id = url.slice(startSliceIndex);
    this.setState({ chatroomID: id });
  },
  initSocketListeners: function (socket) {
    socket.on('chat', this.messageRecieve);
    socket.on('newcomer', this.userJoined);
    socket.on('left', this.userLeft);
    socket.on('connected', function () { console.log('Connected to Chat Socket') });
    socket.on('disconnect', function () { console.log('Disconnected from Chat Socket') });
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

    var socket = this.state.socket;
    var data = {
      msg: this.state.message,
      chatroomID: this.state.chatroomID
    };
    socket.emit('chat', data);

    var messages = this.state.messages;
    messages.unshift({
      name: 'you',
      msg: this.state.message
    });
    this.setState({
      messages: messages,
      message: ''
    });

    $('#inputField').val('');
  },
  handleNameInput: function (e) {
    this.setState({ username: e.target.value });
  },
  connectToSocket: function (e) {
    e.preventDefault();

    // connect to chat socket with chatroomID
    var socket = io(window.location.host);
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
                <input id="inputField" type="text" placeholder="type a message" onChange={this.handleMsgInput} className="form-control" autoComplete='off' />
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
              <input id="inputField" type="text" placeholder="pick a username" onChange={this.handleNameInput} className="form-control" autoComplete='off' />
              <button onClick={this.connectToSocket} className="btn btn-success"> Join </button>
            </form>
          </div>
          <div className="col-md-offset-2"></div>
        </div>
      )
    }
  }
});
