const TopicItem = React.createClass({

  render: function () {
    var url = '/discuss/' + this.props.topic.id + '?topic=' + this.props.topic.title;
    return (
      <p>
        <a href={url}>
          {this.props.topic.title}
        </a>
        &nbsp;
        ({this.props.topic.headCount} ppl)        
      </p>

    );
  }
});
