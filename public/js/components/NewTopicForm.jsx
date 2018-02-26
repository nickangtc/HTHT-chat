import React, { Component } from 'react';


export default class IndexPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: '',
      topics: [],
      error: false,
    }

    // Bindings
    this.handleTopicInput = this.handleTopicInput.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.findSimilarTopics = this.findSimilarTopics.bind(this);
  }

  componentWillMount() {
    $(document).on("keypress", function() {
      $("#topic-input").focus();
    });
    $.ajax({
      method: 'GET',
      url: '/topics',
      success: data => {
        this.setState({ topics: data });
      }
    });
  }

  handleTopicInput(e) {
    this.setState({ topic: e.target.value });
  }

  handleCreate(e) {
    e.preventDefault();

    if (this.state.topic === '') {
      return this.setState({
        error: 'Your room needs a topic!',
      });
    }

    $.ajax({
      method: 'POST',
      url: '/topics',
      data: {
        title: this.state.topic
      },
      success: function (redirectPath) {
        console.log('Post successful', redirectPath);
        window.location.href += redirectPath;
      }
    });
  }

  findSimilarTopics(searchTerm) {
    const result = [];
    const term = searchTerm.toLowerCase();
    if (this.state.topics) {
      for (let i = 0; i < this.state.topics.length; i++) {
        const topic = this.state.topics[i].title.toLowerCase();
        if ( topic.includes(term) ) {
          result.push(this.state.topics[i].title);
        }
      }
      const similarTopics = result.map(function (topic, index) {
        return (
          <option value={topic} key={index} />
        );
      });
      return similarTopics;
    } else { return '' }
  }

  render() {
    return (
      <form onSubmit={this.handleCreate}>
        <datalist id="similar-topics">
          {this.findSimilarTopics(this.state.topic)}
        </datalist>
        { this.state.error &&
          <div className="form-group">
            <p style={{ color: 'red', textAlign: 'left' }}>{ this.state.error }</p>
          </div>
        }
        <div className="form-group">
          <input id="topic-input" list="similar-topics" type="text" onChange={this.handleTopicInput} placeholder="how will AI co-exist with humanity 20 years from now?" className="form-control"/>
        </div>
        <button type="submit" className="btn btn-success btn-lg btn-block">proceed to room</button>
      </form>
    );
  }
}
