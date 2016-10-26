import React from 'react';
import { Link } from 'react-router';

export default class TopicItem extends React.Component {
  render() {
    return (
      <div className="row visualise">
        <div className="col-md-5">
          {this.props.topic.title}
        </div>
        <div className="col-md-2 visualise">
          {this.props.topic.headCount} ppl
        </div>
        <div className="col-md-5">
          <form id="JoinForm" className="form-inline pull-right">
            <fieldset>
              <input type="text" className="form-control" placeholder="your name" autoComplete="off" required />
              // MIGHT HAVE INTEGRATION ISSUES LATER BETW BUTTON NESTED IN LINK
              <Link key={this.props.topic.id} to={`/discuss/${this.props.topic.id}`}>
                <button id="sendJoin" className="btn btn-success">join</button>
              </Link>
            </fieldset>
          </form>
        </div>
      </div>

    );
  }
}
