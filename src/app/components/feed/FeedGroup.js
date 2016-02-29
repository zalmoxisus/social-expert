import React, { Component, PropTypes } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { connect } from 'react-redux';
import cn from 'classnames';
import TooltipButton from '../elements/TooltipButton';
import { markAsRead } from '../../actions/api';
import FeedItem from './FeedItem';
import { openUrl } from '../../services/electron';
import style from './style';

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
      <div className={cn(style.group, { [style.read]: this.state.isRead })}>
        <div className={cn(style.row, style.target)}>
          <div><img className={style.avatar} src={target.get('avatar')} /></div>
          <div className={style.name} onClick={this.openUrl}>
            {target.get('owner') + '/' + target.get('name')}
          </div>
          <div className={style.mark}>
            <TooltipButton
              tooltip="Mark all" onClick={this.markGroupAsRead} icon="done_all" floating mini
            />
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
