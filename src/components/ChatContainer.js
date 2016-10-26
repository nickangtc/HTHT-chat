import React from 'react';

export default class ChatContainer extends React.Component {
  render() {
    return (
      <div>

        <div className="row">
          <div className="col-md-5">
            <form id="MessageForm" className="form-inline pull-right">
              <fieldset>
                <input type="text" className="form-control " placeholder="say what?" autoComplete="off" required />
                <button id="sendMessage" className="btn btn-success" disabled>send</button>
              </fieldset>
            </form>
          </div>
        </div>

        <div id="messages" className="row">
          <ChatMessage msg="something" />
          <ChatMessage />
          <ChatMessage />
        </div>
      </div>
    );
  }
}
