import React, { Component, PropTypes } from 'react';
import { AutoSizer, VirtualScroll } from 'react-virtualized';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import FontIcon from 'react-toolbox/lib/font_icon';
import Toolbar from './Toolbar';
import Loading from '../elements/Loading';
import Error from '../elements/Error';
import { fetchFeed, display } from '../../actions/api';
import { reorderFeed, filterFeed } from '../../utils/feedUtils';
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
    if (this.props.feed) this.virtualScroll.recomputeRowHeights();
  }

  getRowHeight(index) {
    return (this.groups.get(index % this.groups.count())[1].size + 1) * 40;
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
    const { feed, subs, order, section, error, changeOrder, changeSection } = this.props;
    let body;
    if (error) return <Error error={error} />;

    if (feed) {
      if (section) this.groups = filterFeed(feed, subs, section);
      else this.groups = reorderFeed(feed, subs, order);
      body = (
        <AutoSizer>
          {({ height, width }) => (
            <VirtualScroll
              ref={this.mapRef}
              height={height}
              width={width}
              rowsCount={this.groups.count()}
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
        <Toolbar
          order={order} section={section} restricted={!subs}
          changeOrder={changeOrder} changeSection={changeSection}
        />
        <div className={style.feedBody}>{body}</div>
      </div>
    );
  }
}

Feed.propTypes = {
  feed: PropTypes.object,
  subs: PropTypes.object,
  order: PropTypes.number,
  section: PropTypes.number,
  error: PropTypes.string,
  changeOrder: PropTypes.func.isRequired,
  changeSection: PropTypes.func.isRequired,
  fetchFeed: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  feed: state.feed.get('github'),
  subs: state.subs.get('github'),
  order: state.display.getIn(['github', 'order'], 0),
  section: state.display.getIn(['github', 'section'], 0),
  error: state.feed.get('error')
});

export default connect(mapStateToProps, {
  fetchFeed: fetchFeed.request,
  changeOrder: display.order,
  changeSection: display.section
})(Feed);
