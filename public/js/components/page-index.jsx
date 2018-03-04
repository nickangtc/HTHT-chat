import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CreateTopicForm from './form-create-topic.jsx';
import { smoothScroll } from '../util/ui';


class TopicItem extends Component {
  render() {
    const {
      topic,
      createOrRedirect,
    } = this.props;

    const colors = ['#BEFFB3', '#3AE8B0', '#19AFD0', '#6967CE', '#FFB900', '#FD636B'];
    const badgeColor = colors[topic.active_users];
    const preventJoining = topic.active_users >= 5;

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
        <a className="clickable" onClick={() => createOrRedirect(topic.title)}>
          { topic.title }&nbsp;
          <span style={{ backgroundColor: badgeColor }} className="badge">
            { topic.active_users }
          </span>
        </a>
      </li>
    );
  }
}
TopicItem.propTypes = {
  topic: PropTypes.object.isRequired,
  createOrRedirect: PropTypes.func.isRequired,
};

class TopicsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topics: [],
    };
  }

  componentWillMount() {
    $.ajax({
      method: 'GET',
      url: '/topics',
      success: data => this.setState({ topics: data }),
    });
  }

  render() {
    const { topics } = this.state;
    const { createOrRedirect } = this.props;

    const topicsList = topics.map((topic, idx) =>
      <TopicItem key={idx} topic={topic} createOrRedirect={createOrRedirect} />);

    return (
      <div id="topics-list" className="container centralised">
        <div className="row">
          <div className="col-md-8 col-centered">
            <h2>
              Ongoing conversations
            </h2>
            <h4>
              { 'have a heart to heart talk in a room with <= 5 humans' }
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
  static createOrRedirect(topic) {
    if (topic === '') return;

    $.ajax({
      method: 'POST',
      url: '/topics',
      data: {
        title: topic,
      },
      success: (redirectPath) => {
        window.location.href += redirectPath;
      },
    });
  }

  render() {
    return (
      <div>
        <div className="container really centralised">
          <div className="row">
            <div className="col-md-6 col-centered text-center">
              <h3>What&apos;s on your mind right now?</h3>
              <CreateTopicForm createOrRedirect={IndexPage.createOrRedirect} />
              <a className="btn btn-default btn-block margin-top" onClick={() => smoothScroll('topics-list')}>
                join an existing conversation
              </a>
            </div>
          </div>
        </div>
        <TopicsContainer createOrRedirect={IndexPage.createOrRedirect} />
      </div>
    );
  }
}
TopicsContainer.propTypes = {
  createOrRedirect: PropTypes.func.isRequired,
};
