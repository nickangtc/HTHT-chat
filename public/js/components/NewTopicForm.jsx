const NewTopicForm = React.createClass({
  getInitialState: function () {
    return {
      username: '',
      topic: ''
    }
  },
  handleNameInput: function (e) {
    this.setState({ username: e.target.value });
  },
  handleTopicInput: function (e) {
    this.setState({ topic: e.target.value });
  },
  submitCreate: function () {
    $.ajax({
      method: 'POST',
      url: '/topics',
      data: {
        title: this.state.topic
      },
      success: function () {
        window.location.href = window.location.host + '/' + this.state.topic;
      }
    })
  },
  render: function () {
    return (
      <div className="row">
        <div className="col-md-12">
          <p>start your own. topic format: I want to talk about [topic name]</p>
        </div>

        <div className="col-md-12">
          <form className="form-inline">
            <div className="form-group">
              <label className="sr-only" htmlFor="username">username</label>
              <input id="username" type="text" onChange={this.handleNameInput} placeholder="username" className="form-control" autoComplete='off' />
            </div>
            <div className="form-group">
              <label className="sr-only" htmlFor="topic">topic</label>
              <input id="topic" type="text" onChange={this.handleTopicInput} placeholder="how will AI co-exist with humanity 20 years from now?" className="form-control" autoComplete='off' />
            </div>
            <button onClick={this.submitCreate} className="btn btn-success">make room</button>
          </form>
        </div>

      </div>
    );
  }
});
