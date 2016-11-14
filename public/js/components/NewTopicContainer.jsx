const NewTopicContainer = React.createClass({
  render: function () {
    return (
      <div className="container really centralised">
        <div className="row">
          <div className="col-md-6 col-centered text-center">
            <h3>What's on your mind right now?</h3>

            <NewTopicForm />

            <a className="btn btn-default btn-block margin-top" href="#topics-list">
              join an existing conversation
            </a>

          </div>
        </div>
      </div>

    );
  }
});
