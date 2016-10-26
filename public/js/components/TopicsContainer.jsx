
const TopicsContainer = React.createClass({
  render: function () {
    var data = topics;

    var result = topics.map(function(topic) {
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
