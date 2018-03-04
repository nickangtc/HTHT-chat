import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class CreateTopicForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      topic: '',
      topics: [],
      error: false,
    };

    // Bindings
    this.handleTopicInput = this.handleTopicInput.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.findSimilarTopics = this.findSimilarTopics.bind(this);
  }

  componentWillMount() {
    $(document).on('keypress', () => $('#topic-input').focus());
    $.ajax({
      method: 'GET',
      url: '/topics',
      success: (data) => {
        this.setState({ topics: data });
      },
    });
  }

  handleTopicInput(e) {
    this.setState({ topic: e.target.value });
  }

  handleCreate(e) {
    e.preventDefault();

    this.props.createOrRedirect(this.state.topic);
  }

  findSimilarTopics(searchTerm) {
    const result = [];
    const term = searchTerm.toLowerCase();
    if (this.state.topics) {
      for (let i = 0; i < this.state.topics.length; i++) {
        const topic = this.state.topics[i].title.toLowerCase();
        if (topic.includes(term)) {
          result.push(this.state.topics[i].title);
        }
      }
      const similarTopics = result.map((topic, index) => <option value={topic} key={index} />);
      return similarTopics;
    }

    return '';
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
          <input id="topic-input" list="similar-topics" type="text"
            onChange={this.handleTopicInput} className="form-control"
            placeholder="how will AI co-exist with humanity 20 years from now?" />
        </div>
        <button type="submit" className="btn btn-success btn-lg btn-block">proceed to room</button>
      </form>
    );
  }
}
CreateTopicForm.propTypes = {
  createOrRedirect: PropTypes.func.isRequired,
};
