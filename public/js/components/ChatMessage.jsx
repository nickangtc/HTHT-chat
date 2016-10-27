const ChatMessage = React.createClass({
  render: function () {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="panel panel-default">
            <div className="panel-body">
              <small>{this.props.msg.name}</small>
              <p>{this.props.msg.msg}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
