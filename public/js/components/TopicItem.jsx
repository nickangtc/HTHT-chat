const TopicItem = React.createClass({

  render: function () {
    var url = '/discuss/' + this.props.topic.id + '?topic=' + this.props.topic.title;
    return (
      <div className="row">
        <div className="col-md-5">
          <a href={url}>
            {this.props.topic.title}
          </a>
        </div>
        <div className="col-md-2">
          ({this.props.topic.headCount} ppl)
        </div>
      </div>

    );
  }
});
