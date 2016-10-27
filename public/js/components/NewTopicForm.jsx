const NewTopicForm = React.createClass({
  getInitialState: function () {
    return {
      topic: ''
    }
  },
  handleTopicInput: function (e) {
    this.setState({ topic: e.target.value });
  },
  handleCreate: function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/topics',
      data: {
        title: this.state.topic
      },
      success: function (redirectPath) {
        console.log('Post successful', redirectPath);
        window.location.href += redirectPath;
      }
    });
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
              <label className="sr-only" htmlFor="topic">topic</label>
              <input size="48" id="topic" type="text" onChange={this.handleTopicInput} placeholder="how will AI co-exist with humanity 20 years from now?" className="form-control" autoComplete='off' />
            </div>
            <button onClick={this.handleCreate} className="btn btn-primary">make room</button>
          </form>
        </div>

      </div>
    );
  }
});
