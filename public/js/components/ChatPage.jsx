const ChatPage = React.createClass({
  render: function () {
    return (
      <div className="container">

        <div className="row">
          <ChatInput />
        </div>

        <div className="row">
          <ChatContainer />
        </div>
      </div>
    );
  }
});
