const NewTopicForm = React.createClass({

  render: function () {
    return (
      <div className="row">
        <div className="col-md-12">
          <p>start your own. topic format: I want to talk about [topic name]</p>
        </div>

        <div className="col-md-12">
          <form className="form-inline">
            <div className="form-group">
              <label className="sr-only" htmlFor="username">username</label>
              <input  type="text" className="form-control" id="username" placeholder="username" />
            </div>
            <div className="form-group">
              <label className="sr-only" htmlFor="topic">topic</label>
              <input type="text" className="form-control" id="topic" placeholder="AI in the next 10 years" />
            </div>
            <button onSubmit={this.submitJoinRequest} className="btn btn-success">make room</button>
          </form>
        </div>

      </div>
    );
  }
});
