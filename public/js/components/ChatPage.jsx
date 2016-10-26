const ChatPage = React.createClass({
  render: function () {
    return (
      <div className="container">
        <div className="row">
          <h1>HELLO WELCOME TO CHATPAGE</h1>
        </div>

        <div className="row">
          <p>Param is {this.props.params.id}</p>
        </div>

        <div className="row">
          <Link to="/">home</Link>
        </div>
      </div>
    );
  }
});
