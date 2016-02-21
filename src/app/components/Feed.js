import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import Loading from 'reloading';
import MdErrorOutline from 'react-icons/lib/md/error-outline';
import MdThumbUp from 'react-icons/lib/md/thumb-up';
import { fetchFeed } from '../actions/api';
import FeedGroup from './FeedGroup';

class Feed extends Component {
  componentDidMount() {
    this.props.fetchFeed();
  }

  render() {
    const { feed } = this.props;
    let posts;
    let errors;
    let noPosts;

    if (this.props.feedError) {
      errors = (
        <div className="alert">
          <h3>Oops. Something went wrong.</h3>
          <h2>Please try again later.</h2>
          <MdErrorOutline className="icon-big"/>
        </div>
      );
    } else if (feed) {
      noPosts = !feed.result.length;
      if (noPosts) {
        posts = (
          <div className="alert">
            <h2>Awesome! <span className="what">&nbsp;</span></h2>
            <h3>No new notifications.</h3>
            <MdThumbUp className="icon-big"/>
          </div>
        );
      } else {
        const groupedNotifications = _.groupBy(
          feed.entities.posts,
          object => object.target
        );

        posts = (
          _.map(groupedNotifications, function (obj) {
            const target = obj[0].target;
            return <FeedGroup target={feed.entities.targets[target]} posts={obj} key={target} />;
          })
        );
      }
    }

    return (
      <div className={
          'container-fluid main-container notifications' +
          (this.props.feedError ? ' errored' : '') +
          (noPosts ? ' all-read' : '')
        }
      >
        <Loading className="loading-container" shouldShow={!feed}>
          <div className="loading-text">working on it</div>
        </Loading>
        {errors}
        {posts}
      </div>
    );
  }
}

Feed.propTypes = {
  feed: PropTypes.object,
  feedError: PropTypes.string,
  fetchFeed: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  feed: state.feed.github,
  feedError: state.feed.error
});

export default connect(mapStateToProps, {
  fetchFeed: fetchFeed.request
})(Feed);
