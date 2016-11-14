const NewTopicForm = React.createClass({
  getInitialState: function () {
    return {
      topic: ''
    }
  },
  componentWillMount: function () {
    $(document).on("keypress", function() {
      $("#input").focus();
    });
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
      <form>
        <div className="form-group">
          <input id="input" size="20" type="text" onChange={this.handleTopicInput} placeholder="how will AI co-exist with humanity 20 years from now?" className="form-control" autoComplete='off' />
        </div>
        <button onClick={this.handleCreate} className="btn btn-primary">make room</button>
      </form>
    );
  }
});
