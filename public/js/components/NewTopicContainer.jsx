const NewTopicContainer = React.createClass({
  render: function () {
    return (
      <div className="container really centralised">
        <div className="row">
          <div className="col-md-12 text-center">
            <h3>What conversation would you like to have today?</h3>

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
