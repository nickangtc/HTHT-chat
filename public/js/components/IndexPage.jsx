import React, { Component } from 'react';

import NewTopicForm from './NewTopicForm.jsx';


class TopicItem extends Component {
  render() {
    const url = '/discuss/' + this.props.topic.id + '?topic=' + this.props.topic.title;
    return (
      <li className="list-group-item">
        <a href={url}>
          {this.props.topic.title}
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
      success: function (data) {
        this.setState({ topics: data })
      }.bind(this)
    });
  }

  render() {
    const result = this.state.topics.map(function(topic) {
      return (
        <TopicItem key={topic.id} topic={topic} />
      );
    }.bind(this));

    return (
      <div id="topics-list" className="container centralised">
        <div className="row">
          <div className="col-md-8 col-centered">
            <h2>
              Ongoing conversations
            </h2>
            <h4>
              only rooms with less than 5 people are shown because nobody likes talking in a market
            </h4>
            <div className="panel panel-default margin-top">
              <ul className="list-group">
                {result}
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

              <a className="btn btn-default btn-block margin-top" href="#topics-list">
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
