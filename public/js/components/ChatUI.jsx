// TODO: updateOnlineWidget and render <WhosOnlineWidget />

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
      messages: []
    }
  },
  componentWillMount: function () {
    // get page id from url
    var url = window.location.pathname.toString();
    var startSliceIndex = url.indexOf('/', 1) + 1;
    var id = url.slice(startSliceIndex);
    this.setState({ chatroomID: id });

    // on any keypress, autofocus to input field
    $(document).on("keypress", function() {
      $("#inputField").focus();
    });
  },
  initSocketListeners: function (socket) {
    socket.on('chat', this.messageRecieve);
    socket.on('newcomer', this.userJoined);
    socket.on('left', this.userLeft);
    socket.on('online', this.updateOnlineWidget);
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
    var msg = this.state.message;
    socket.emit('chat', msg);

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
  updateOnlineWidget: function (connections) {
    var users = [];
    for (var i = 0; i < connections.length; i++) {
      if (connections[i].id === this.state.chatroomID) {
        users.push(connections[i]['user']);
      }
    }
    this.setState({ users: users });
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
                <button onClick={this.sendMsg} className="btn btn-primary">Send</button>
              </form>
            </div>
            <div className="col-md-offset-2"></div>
          </div>

          <br />

          <div className="row">
            <div className="col-md-offset-1" />
            <div className="col-md-8">
              {allMessages}
            </div>
            <div className="col-md-2">
              <WhosOnlineWidget users={this.state.users} />
            </div>
            <div className="col-md-offset-1" />
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
              <button onClick={this.connectToSocket} className="btn btn-primary"> Join </button>
            </form>
          </div>
          <div className="col-md-offset-2"></div>
        </div>
      )
    }
  }
});
