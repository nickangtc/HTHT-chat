const TopicItem = React.createClass({

  render: function () {
    var url = '/discuss/' + this.props.topic.id + '?topic=' + this.props.topic.title;
    return (
      <div className="row visualise">
        <div className="col-md-5">
          {this.props.topic.title}
        </div>
        <div className="col-md-2 visualise">
          {this.props.topic.headCount} ppl
        </div>
        <div className="col-md-5">
          <a href={url}> join </a>
        </div>
      </div>

    );
  }
});
