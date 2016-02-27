import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import Immutable from 'immutable';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import DragDropContext from 'react-dnd/lib/DragDropContext';
import Touch from 'react-dnd-touch-backend';
import Loading from 'reloading';
import { fetchSubs, reorderSubs } from '../../actions/api';
import { default as ItemPreview } from './ItemPreview';
import SortableList from './SortableList.js';

@immutableRenderDecorator
class Sortable extends Component {
  componentDidMount() {
    this.props.fetchSubs();
  }

  render() {
    const subs = this.props.subs;
    let lists;
    if (subs) {
      lists = subs.get('groups').toArray().map((list, i) => (
        <SortableList
          key={i} idx={i} list={list}
          targets={subs.get('targets')}
          onReorder={this.props.reorderSubs}
        />
      ));
    }
    return (
      <div className="row">
        <Loading className="loading-container" shouldShow={!subs}>
          <div className="loading-text">loading your subscriptions</div>
        </Loading>
        {lists}
        <ItemPreview/>
      </div>
    );
  }
}

Sortable.propTypes = {
  subs: PropTypes.object,
  error: PropTypes.string,
  fetchSubs: PropTypes.func.isRequired,
  reorderSubs: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  subs: state.subs.get('github'),
  error: state.subs.get('error')
});

const mapDispatchToProps = dispatch => ({
  fetchSubs: () => { dispatch(fetchSubs.request()); },
  reorderSubs: (fromObj, toObj) => {
    dispatch(reorderSubs('github', fromObj, toObj));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(
  DragDropContext(Touch({ enableMouseEvents: true }))(Sortable)
);
