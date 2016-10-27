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
      <div>
        <div className="col-md-offset-2"></div>
        <div className="col-md-8">
          {result}
        </div>
        <div className="col-md-offset-2"></div>
      </div>
    );
  }
});
