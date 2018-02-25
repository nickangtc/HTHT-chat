import React, { Component } from 'react';

export default class WhosOnlineWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: []
    }
  }

  render() {
    const users = this.props.users;
    let list = [];

    if (users) {
      list = this.state.users.map(function (user, ind) {
        return (
          <div key={ind}>
            <p>{user}</p>
          </div>
        )
      });
    }

    return (
      // THIS IS WHERE I STOPPED WORKING!!!!
      // NEXT TO DO: MAKE THE WHOSONLINEWIDGET APPEAR ON THE PAGE
      // see breadcrumbs in ChatUI.jsx
      <div>
        {list}
      </div>
    );
  }
}
