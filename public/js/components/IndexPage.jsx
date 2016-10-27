const IndexPage = React.createClass({

  render: function () {
    return (
      <div className="container">

        <div className="row">
          <div className="col-md-offset-3"></div>
          <div className="col-md-6">
            <h2>reson8</h2>
          </div>
          <div className="col-md-offset-3"></div>
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
