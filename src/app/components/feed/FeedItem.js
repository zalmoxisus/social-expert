import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import getIcon from '../elements/getIcon';
import TooltipButton from '../elements/TooltipButton';
import { markAsRead } from '../../actions/api';
import { markThreadAsRead } from '../../api/github';
import { openUrl } from '../../services/electron';
import cn from 'classnames';
import style from './style';

class FeedItem extends Component {
  constructor(props) {
    super(props);
    this.state = { isRead: false };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.isRead !== nextState.isRead;
  }

  pressTitle = () => {
    openUrl(this.props.post.get('url'));
    this.markAsRead();
  };

  markAsRead = () => {
    this.props.markAsRead({
      id: this.props.post.get('id'),
      targetId: this.props.targetId
    });
    this.setState({ isRead: true });
  };

  render() {
    const post = this.props.post;
    return (
      <div className={cn(style.row, { [style.read]: this.state.isRead })}>
        <div className={style.icon}>{getIcon(post.get('type'))}</div>
        <div className={style.name} onClick={this.pressTitle}>
          {post.get('subject')}
        </div>
        <div className={style.mark}>
          <TooltipButton
            tooltip="Mark as read" onClick={this.markAsRead} icon="done" floating mini
          />
        </div>
      </div>
    );
  }
}

FeedItem.propTypes = {
  post: PropTypes.object.isRequired,
  targetId: PropTypes.number.isRequired,
  markAsRead: PropTypes.func.isRequired
};

export default connect(undefined, {
  markAsRead: markAsRead.request
})(FeedItem);
