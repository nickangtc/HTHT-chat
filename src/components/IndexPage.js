import React from 'react';
import TopicsContainer from './TopicsContainer';
import activeChats from '../data/activeChats';

export default class IndexPage extends React.Component {
  render() {
    return (
      <div className="home">
        <div className="activeChats-selector">
          {activeChats.map(activeChat => <TopicsContainer key={activeChat.id} {...activeChat} />)}
        </div>
      </div>
    );
  }
}
