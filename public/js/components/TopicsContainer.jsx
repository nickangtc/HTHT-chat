const TopicsContainer = React.createClass({
  render: function () {
    var topics = [
      {
        id: 1,
        title: 'will we see AI in our lifetime?',
        headCount: 2
      },
      {
        id: 2,
        title: 'the maddest US presidential elections ever',
        headCount: 1
      },
      {
        id: 3,
        title: 'the beauty of trees in cities',
        headCount: 3
      }
    ];

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
