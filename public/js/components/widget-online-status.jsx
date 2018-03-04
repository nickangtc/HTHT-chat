import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class OnlineStatusWidget extends Component {
  render() {
    const {
      users,
      currentUser,
      colors,
    } = this.props;

    let list = [];

    if (users) {
      list = users.map((user, ind) => {
        const name = currentUser === user ? `${user} (me)` : user;
        return (
          <span className="username-bubble" key={ind} style={{ backgroundColor: colors[ind] }}>
            { name }
          </span>
        );
      });
    }

    return (
      <div id="whos-online-widget" className="col-md-8 col-centered text-center">
        {list}
      </div>
    );
  }
}
OnlineStatusWidget.propTypes = {
  users: PropTypes.array.isRequired,
  currentUser: PropTypes.string.isRequired,
  colors: PropTypes.array.isRequired,
};
