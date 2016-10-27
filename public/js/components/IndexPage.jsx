const IndexPage = React.createClass({

  render: function () {
    return (
      <div className="container">

        <div className="row">
          <div className="col-md-offset-2"></div>
          <div className="col-md-8">
            <h2>parsun</h2>
            <p>party of five or less, talking about anything under the sun</p>
          </div>
          <div className="col-md-offset-2"></div>
        </div>

        <div className="row">
          <h3>join a discussion</h3>
          <TopicsContainer />
        </div>

        <div className="row">
          <h3>can't find an existing discussion to join?</h3>
          <NewTopicContainer />
        </div>

      </div>
    );
  }
});
