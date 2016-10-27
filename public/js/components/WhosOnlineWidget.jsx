const WhosOnlineWidget = React.createClass({
  getInitialState: function () {
    return {
      users: []
    }
  },
  render: function () {
    var users = this.props.users;
    if (users) {
      var list = this.state.users.map(function (user, ind) {
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
});
