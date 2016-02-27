import React, { Component, PropTypes } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { connect } from 'react-redux';
import MdDoneAll from '../../../../node_modules/react-icons/lib/md/done-all';
import { markAsRead } from '../../actions/api';
import FeedItem from './FeedItem';
import { openUrl } from '../../services/electron';

@immutableRenderDecorator
class FeedGroup extends Component {
  constructor(props) {
    super(props);
    this.state = { isRead: false };
  }

  markGroupAsRead = () => {
    const { id, owner, name } = this.props.target.toObject();
    this.props.markAsRead({ id, owner, targetName: name });
    this.setState({ isRead: true });
  };

  openUrl = () => {
    openUrl(this.props.target.get('url'));
  };

  render() {
    const target = this.props.target;
    return (
      <div>
        <div className={this.state.isRead ? 'row feed-group read' : 'row feed-group'}>
          <div className="col-xs-2"><img className="avatar" src={target.get('avatar')} /></div>
          <div className="col-xs-9 name" onClick={this.openUrl}>
            <span>{'/' + target.get('name')}</span>
            <span>{target.get('owner')}</span>
          </div>
          <div className="col-xs-1 check-wrapper" title="Mark all as read">
            <MdDoneAll onClick={this.markGroupAsRead}/>
          </div>
        </div>

        {this.props.posts.valueSeq().map(obj => (
          <FeedItem
            isRead={this.state.isRead}
            targetId={this.props.target.get('id')}
            post={obj} key={obj.get('id')}
          />
        ))}

      </div>
    );
  }
}

FeedGroup.propTypes = {
  target: PropTypes.object.isRequired,
  posts: PropTypes.object.isRequired,
  markAsRead: PropTypes.func.isRequired
};

export default connect(undefined, {
  markAsRead: markAsRead.request
})(FeedGroup);
