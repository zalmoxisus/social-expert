import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import MdDone from 'react-icons/lib/md/done';
import GoIssueOpened from 'react-icons/lib/go/issue-opened';
import GoPullRequest from 'react-icons/lib/go/git-pull-request';
import GoCommit from 'react-icons/lib/go/git-commit';
import GoTag from 'react-icons/lib/go/tag';
import GoQuestion from 'react-icons/lib/go/question';
import { markAsRead } from '../actions/api';
import { markThreadAsRead } from '../api/github';
import { openUrl } from '../services/electron';

class FeedItem extends Component {
  constructor(props) {
    super(props);
    this.state = { isRead: this.props.isRead };
  }

  getIcon() {
    switch (this.props.post.type) {
      case 'Issue':
        return <GoIssueOpened/>;
      case 'PullRequest':
        return <GoPullRequest/>;
      case 'Commit':
        return <GoCommit/>;
      case 'Release':
        return <GoTag/>;
      default:
        return <GoQuestion/>;
    }
  }

  pressTitle = () => {
    openUrl(this.props.post.url);
    this.markAsRead();
  };

  markAsRead = () => {
    this.props.markAsRead(this.props.post.id);
    this.setState({ isRead: true });
  };

  render() {
    const post = this.props.post;
    return (
      <div className={this.state.isRead ? 'row notification read' : 'row notification'}>
        <div className="col-xs-1 post-icon" title={post.type}>{this.getIcon()}</div>
        <div className="col-xs-10 subject" onClick={this.pressTitle}>
          {post.subject}
        </div>
        <div className="col-xs-1 check-wrapper" title="Mark as read">
          <MdDone onClick={this.markAsRead}/>
        </div>
      </div>
    );
  }
}

FeedItem.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    type: PropTypes.string
  }).isRequired,
  isRead: PropTypes.bool.isRequired,
  markAsRead: PropTypes.func.isRequired
};

export default connect(undefined, {
  markAsRead: markAsRead.request
})(FeedItem);
