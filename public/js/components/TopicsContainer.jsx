const TopicsContainer = React.createClass({
  getInitialState: function () {
    return {
      topics: []
    }
  },
  componentWillMount: function () {
    $.ajax({
      method: 'GET',
      url: '/topics',
      success: function (data) {
        this.setState({ topics: data })
      }.bind(this)
    });
  },
  render: function () {

    var result = this.state.topics.map(function(topic) {
      return (
        <TopicItem key={topic.id} topic={topic} />
      );
    }.bind(this));

    return (
      <div id="topics-list" className="container">
        <div className="row">
          <div className="col-md-offset-2"></div>
          <div className="col-md-8">

            <h2>Current conversations</h2>

            {result}

          </div>
          <div className="col-md-offset-2"></div>
        </div>
      </div>
    );
  }
});
