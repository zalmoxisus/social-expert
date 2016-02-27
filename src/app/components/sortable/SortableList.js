import React, { Component, PropTypes } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import { List, Map } from 'immutable';
import DragSource from 'react-dnd/lib/DragSource';
import DropTarget from 'react-dnd/lib/DropTarget';
import DraggableItem from './DraggableItem';

const dropTarget = {
  drop(props, monitor) {
    if (monitor.didDrop()) return;
    const item = monitor.getItem();
    if (props.idx === item.listIdx) return;
    item.onReorder({
      listIdx: item.listIdx,
      id: item.id
    }, {
      listIdx: props.idx
    });
  }
};

@DropTarget('Item', dropTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: false })
}))
@immutableRenderDecorator
export default class SortableList extends Component {
  getTitle() {
    switch (this.props.idx) {
      case 0: return 'High priority';
      case 1: return 'Standard priority';
      default: return 'Low priority';
    }
  }

  render() {
    const { idx, list, targets, connectDropTarget, onReorder } = this.props;
    let items;
    items = list.toArray().map(id => {
      const target = targets.get(id);
      const name = `${target.get('owner')}/${target.get('name')}`;
      return (
        <DraggableItem
          key={id} id={id}
          listIdx={idx}
          name={name}
          onReorder={onReorder}
        />
      );
    });

    return connectDropTarget(
      <div className="col-xs-4">
        <div className={`card-title priority-${idx}`}>{this.getTitle()}</div>
        <div className="cards">{items}</div>
      </div>
    );
  }
}

SortableList.propTypes = {
  idx: PropTypes.number.isRequired,
  list: PropTypes.instanceOf(List),
  targets: PropTypes.instanceOf(Map),
  connectDropTarget: PropTypes.func,
  onReorder: PropTypes.func
};
