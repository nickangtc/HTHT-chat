import React, { Component } from 'react';

export default class WhosOnlineWidget extends Component {
  render() {
    const colors = ['#3AE8B0', '#19AFD0', '#6967CE', '#FFB900', '#FD636B'];
    const {
      users,
      currentUser,
    } = this.props;

    let list = [];

    if (users) {
      list = users.map(function (user, ind) {
        const name = currentUser === user ? `${user} (me)` : user;
        return (
          <span className="username-bubble" key={ind} style={{ backgroundColor: colors[ind] }}>
            { name }
          </span>
        )
      });
    }

    return (
      <div id="whos-online-widget" className="col-md-8 col-centered text-center">
        {list}
      </div>
    );
  }
}
