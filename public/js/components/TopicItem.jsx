const TopicItem = React.createClass({

  render: function () {
    var url = '/discuss/' + this.props.topic.id + '?topic=' + this.props.topic.title;
    return (
      <li className="list-group-item">
        <a href={url}>
          {this.props.topic.title}
        </a>
      </li>

    );
  }
});
