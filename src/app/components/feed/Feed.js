import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Loading from 'reloading';
import MdErrorOutline from '../../../../node_modules/react-icons/lib/md/error-outline';
import MdThumbUp from '../../../../node_modules/react-icons/lib/md/thumb-up';
import { fetchFeed } from '../../actions/api';
import { reorderFeed } from '../../utils/feedUtils';
import FeedGroup from './FeedGroup';

class Feed extends Component {
  componentDidMount() {
    this.props.fetchFeed();
  }

  render() {
    const { feed, subs, order, error } = this.props;
    let body;
    let errors;
    let noPosts;

    if (error) {
      errors = (
        <div className="alert">
          <h3>Oops. Something went wrong.</h3>
          <h2>Please try again later.</h2>
          <MdErrorOutline className="icon-big"/>
        </div>
      );
    } else if (feed) {
      noPosts = !feed.get('result').size;
      if (noPosts) {
        body = (
          <div className="alert">
            <h2>Awesome! <span className="what">&nbsp;</span></h2>
            <h3>No new notifications.</h3>
            <MdThumbUp className="icon-big"/>
          </div>
        );
      } else {
        body = reorderFeed(feed, subs, order).map(target => (
          <FeedGroup
            target={feed.getIn(['targets', String(target[0])])}
            posts={target[1]} key={target[0]}
          />
        ));
      }
    }

    return (
      <div className={
          'container-fluid main-container notifications' +
          (error ? ' errored' : '') +
          (noPosts ? ' all-read' : '')
        }
      >
        <Loading className="loading-container" shouldShow={!feed}>
          <div className="loading-text">loading your notifications</div>
        </Loading>
        {errors}
        {body}
      </div>
    );
  }
}

Feed.propTypes = {
  feed: PropTypes.object,
  subs: PropTypes.object,
  order: PropTypes.number,
  error: PropTypes.string,
  fetchFeed: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  feed: state.feed.get('github'),
  subs: state.subs.get('github'),
  order: 0,
  error: state.feed.get('error')
});

export default connect(mapStateToProps, {
  fetchFeed: fetchFeed.request
})(Feed);
