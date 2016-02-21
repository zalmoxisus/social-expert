import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import MdDoneAll from 'react-icons/lib/md/done-all';
import { markAsRead } from '../actions/api';
import FeedItem from './FeedItem';
import { openUrl } from '../services/electron';

class FeedGroup extends Component {
  constructor(props) {
    super(props);
    this.state = { isRead: false };
  }

  markGroupAsRead = () => {
    const { id, owner, name } = this.props.target;
    this.props.markAsRead(id, owner, name);
    this.setState({ isRead: true });
  };

  openUrl = () => {
    openUrl(this.props.target.url);
  };

  render() {
    const { target } = this.props;
    return (
      <div>
        <div className={this.state.isRead ? 'row feed-group read' : 'row feed-group'}>
          <div className="col-xs-2"><img className="avatar" src={target.avatar} /></div>
          <div className="col-xs-9 name" onClick={this.openUrl}>
            <span>{'/' + target.name}</span>
            <span>{target.owner}</span>
          </div>
          <div className="col-xs-1 check-wrapper" title="Mark all as read">
            <MdDoneAll onClick={this.markGroupAsRead}/>
          </div>
        </div>

        {this.props.posts.map(obj => (
          <FeedItem
            isRead={this.state.isRead}
            post={obj} key={obj.id}
          />
        ))}

      </div>
    );
  }
}

FeedGroup.propTypes = {
  target: PropTypes.object.isRequired,
  posts: PropTypes.array.isRequired,
  markAsRead: PropTypes.func.isRequired
};

export default connect(undefined, {
  markAsRead: markAsRead.request
})(FeedGroup);
