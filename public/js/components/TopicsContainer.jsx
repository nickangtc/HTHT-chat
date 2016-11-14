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
      <div id="topics-list" className="container centralised">
        <div className="row">
          <div className="col-md-8 col-centered">
            <h2>
              Ongoing conversations
            </h2>
            <h4>
              only rooms with less than 5 people are shown because nobody likes talking in a market
            </h4>

            <div className="panel panel-default margin-top">
              <ul className="list-group">
                {result}
              </ul>
            </div>


          </div>
        </div>
      </div>
    );
  }
});
