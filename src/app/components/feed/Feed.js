import React, { Component, PropTypes } from 'react';
import { AutoSizer, VirtualScroll } from 'react-virtualized';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import FontIcon from 'react-toolbox/lib/font_icon';
import Loading from '../elements/Loading';
import { fetchFeed } from '../../actions/api';
import { reorderFeed } from '../../utils/feedUtils';
import FeedGroup from './FeedGroup';
import style from './style';

class Feed extends Component {
  constructor(props) {
    super(props);
    this.mapRef = this.mapRef.bind(this);
    this.getRowHeight = this.getRowHeight.bind(this);
    this.rowRenderer = this.rowRenderer.bind(this);
    this.noRowsRenderer = this.noRowsRenderer.bind(this);
  }

  componentDidMount() {
    if (!this.props.feed) this.props.fetchFeed();
  }

  componentDidUpdate() {
    this.virtualScroll.recomputeRowHeights();
  }

  getRowHeight(index) {
    return (this.groups.get(index % this.groups.size)[1].size + 1) * 40;
  }

  mapRef(node) {
    this.virtualScroll = node;
  }

  rowRenderer(index) {
    const target = this.groups.get(index);
    return (
      <FeedGroup
        target={this.props.feed.getIn(['targets', String(target[0])])}
        posts={target[1]} key={target[0]}
      />
    );
  }

  noRowsRenderer() {
    return (
      <div className={style.allRead}>
        <h2>Awesome!</h2>
        <h3>No new notifications.</h3>
        <FontIcon value="thumb_up" className={style.iconBig} />
      </div>
    );
  }

  render() {
    const { feed, subs, order, error } = this.props;
    let body;

    if (error) {
      body = (
        <div className={style.errored}>
          <h3>Oops. Something went wrong.</h3>
          <h2>Please try again later.</h2>
          <FontIcon value="error_outline" className={style.iconBig} />
        </div>
      );
    } else if (feed) {
      this.groups = reorderFeed(feed, subs, order);
      body = (
        <AutoSizer>
          {({ height, width }) => (
            <VirtualScroll
              ref={this.mapRef}
              height={height}
              width={width}
              rowsCount={this.groups.size}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              noRowsRenderer={this.noRowsRenderer}
              overscanRowsCount={5}
            />
          )}
        </AutoSizer>
      );
    }

    return (
      <div className={style.feed}>
        <Loading shouldShow={!feed} loadingText="loading your notifications" />
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
