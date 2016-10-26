import React from 'react';

const ChatMessage = React.createClass({
  render: function () {
    return (
      <div className="row">
        <div className="panel panel-default">
          <div className="panel-body">
            <p>name</p>
            <p>message...</p>
          </div>
        </div>
      </div>
    );
  }
});
