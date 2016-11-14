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
  findSimilarTopics: function (searchTerm) {
    var result = [];
    var term = searchTerm.toLowerCase();
    if (this.state.topics) {
      for (var i = 0; i < this.state.topics.length; i++) {
        var topic = this.state.topics[i].title.toLowerCase();
        if ( topic.includes(term) ) {
          result.push(this.state.topics[i].title);
        }
      }
      var similarTopics = result.map(function (topic, index) {
        return (
          <option value={topic} key={index} />
        );
      });
      return similarTopics;
    } else { return '' }
  },
  render: function () {
    return (
      <form>
        <datalist id="similar-topics">
          {this.findSimilarTopics(this.state.topic)}
        </datalist>
        <div className="form-group">
          <input id="topic-input" list="similar-topics" type="text" data-toggle="dropdown" onChange={this.handleTopicInput} placeholder="how will AI co-exist with humanity 20 years from now?" className="form-control restrict-width"/>
        </div>
        <button onClick={this.handleCreate} className="btn btn-success">make room</button>
      </form>
    );
  }
});
