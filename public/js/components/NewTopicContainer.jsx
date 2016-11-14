const NewTopicContainer = React.createClass({
  render: function () {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12 text-center">
            <h2>What conversation would you like to have today?</h2>

            <NewTopicForm />

            <a href="#topics-list">
              Join an existing conversation
            </a>

          </div>
        </div>
      </div>

    );
  }
});
