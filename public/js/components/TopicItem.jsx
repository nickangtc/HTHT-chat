const TopicItem = React.createClass({
  getInitialState: function () {
    return {
      name: ''
    }
  },
  submitJoinForm: function (e) {
    e.preventDefault();

    if (this.state.name.length !== 0) {
      var user = {
        name: this.state.name
      };
      // var socket = io('/my-namespace');

      // declaring socket opens a socket connection with server
      var socket = io(window.location.host);
      socket.on('connect', function () {
        console.log('Connected to Chat Socket');
        console.log('Redirecting to Chatroom');
        $.get('/discuss/1');
      });

      // explicitly tell server about join success
      socket.emit('join', user);
      console.log('Joining chat with name: ', user.name);
    }
  },
  updateUsername: function (e) {
    this.setState({ name: e.target.value });
  },
  render: function () {
    return (
      <div className="row visualise">
        <div className="col-md-5">
          {this.props.topic.title}
        </div>
        <div className="col-md-2 visualise">
          {this.props.topic.headCount} ppl
        </div>
        <div className="col-md-5">
          <form id="JoinForm" className="form-inline pull-right">
            <fieldset>
              <input onChange={this.updateUsername} type="text" className="form-control" placeholder="your name" autoComplete="off" required />
              <button onClick={this.submitJoinForm} className="btn btn-success">join</button>
            </fieldset>
          </form>
        </div>
      </div>

    );
  }
});
