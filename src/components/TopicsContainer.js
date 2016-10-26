import React from 'react';
import activeChats from '../data/activeChats';

export default class TopicsContainer extends React.Component {
  render() {

    var result = activeChats.map(function(activeChat) {
      return (
        <TopicItem key={activeChat.id} topic={activeChat} />
      );
    }.bind(this));

    return (
      <div className="visualise">
        {result}
      </div>
    );
  }
}
