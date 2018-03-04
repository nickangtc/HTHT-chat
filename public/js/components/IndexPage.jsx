import React, { Component } from 'react';

import NewTopicForm from './NewTopicForm.jsx';
import { smoothScroll } from '../util/ui.js';


class TopicItem extends Component {
  render() {
    const { topic } = this.props;
    const url = '/discuss/' + this.props.topic.id + '?topic=' + this.props.topic.title;
    const colors = ['#BEFFB3', '#3AE8B0', '#19AFD0', '#6967CE', '#FFB900', '#FD636B'];
    const badgeColor = colors[topic.active_users];
    const preventJoining = topic.active_users >= 5 ? true : false;

    if (preventJoining) {
      return (
        <li className="list-group-item">
          <span>
            { topic.title }&nbsp;
            <span style={{ backgroundColor: badgeColor }} className="badge">
              { topic.active_users }
            </span>
          </span>
        </li>
      );
    }
    return (
      <li className="list-group-item">
        <a href={url}>
          { topic.title }&nbsp;
          <span style={{ backgroundColor: badgeColor }} className="badge">
            { topic.active_users }
          </span>
        </a>
      </li>
    );
  }
}

class TopicsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topics: []
    }
  }

  componentWillMount() {
    $.ajax({
      method: 'GET',
      url: '/topics',
      success: data => this.setState({ topics: data })
    });
  }

  render() {
    const { topics } = this.state;
    const topicsList = topics.map(topic => <TopicItem key={topic.id} topic={topic} />);

    return (
      <div id="topics-list" className="container centralised">
        <div className="row">
          <div className="col-md-8 col-centered">
            <h2>
              Ongoing conversations
            </h2>
            <h4>
              a room can only accommodate 5 people
            </h4>
            <div className="panel panel-default margin-top">
              <ul className="list-group">
                {topicsList}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default class IndexPage extends Component {
  render() {
    return (
      <div>
        <div className="container really centralised">
          <div className="row">
            <div className="col-md-6 col-centered text-center">
              <h3>What's on your mind right now?</h3>

              <NewTopicForm />

              <a className="btn btn-default btn-block margin-top" onClick={() => smoothScroll('topics-list')}>
                join an existing conversation
              </a>

            </div>
          </div>
        </div>
        <TopicsContainer />
      </div>
    );
  }
}
