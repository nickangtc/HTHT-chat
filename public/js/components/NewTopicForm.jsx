const NewTopicForm = React.createClass({
  getInitialState: function () {
    return {
      topic: '',
      topics: []
    }
  },
  componentWillMount: function () {
    $(document).on("keypress", function() {
      $("#topic-input").focus();
    });
    $.ajax({
      method: 'GET',
      url: '/topics',
      success: function (data) {
        this.setState({ topics: data })
      }.bind(this)
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
          <input id="topic-input" type="text" data-toggle="dropdown" onChange={this.handleTopicInput} placeholder="how will AI co-exist with humanity 20 years from now?" className="form-control restrict-width"/>
        </div>
        <button onClick={this.handleCreate} className="btn btn-success">make room</button>
      </form>
    );
  }
});
