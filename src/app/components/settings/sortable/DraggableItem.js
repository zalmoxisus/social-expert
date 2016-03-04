// Based on https://github.com/yahoo/react-dnd-touch-backend/tree/master/examples

import React, { Component, PropTypes } from 'react';
import { immutableRenderDecorator } from 'react-immutable-render-mixin';
import DragSource from 'react-dnd/lib/DragSource';
import DropTarget from 'react-dnd/lib/DropTarget';
import FontIcon from 'react-toolbox/lib/font_icon';
import { openUrl } from '../../../services/electron';
import cn from 'classnames';
import style from './style';

/**
 * The docs for the following functions can be found in
 * react-dnd's docs: http://gaearon.github.io/react-dnd/docs-overview.html
 */
const dragSource = {
  beginDrag(props) {
    return {
      id: props.id,
      listIdx: props.listIdx,
      name: props.name,
      onReorder: props.onReorder
    };
  }
};

const dropTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();
    // Don't trigger reorder if it's to the same spot
    if (
      item.listIdx === props.listIdx &&
      item.id === props.id
    ) {
      return;
    }
    item.onReorder(
      {
        listIdx: item.listIdx,
        id: item.id
      },
      {
        listIdx: props.listIdx,
        id: props.id
      });
  }
};

@DragSource('Item', dragSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))
@DropTarget('Item', dropTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
}))
@immutableRenderDecorator
export default class Item extends Component {
  constructor(props) {
    super(props);
    this.openInBrowser = this.openInBrowser.bind(this);
  }

  openInBrowser() {
    openUrl(`https://github.com/${this.props.name}`);
  }

  render() {
    let content = (
      <div
        className={cn(style.card, {
          [style.isOver]: this.props.isOver,
          [style.isDragging]: this.props.isDragging
        })}
        title={this.props.name}
      >
        <FontIcon value="open_in_new" className={style.icon} onClick={this.openInBrowser} />
        {this.props.name}
      </div>
    );

    // Connect as drag source
    content = this.props.connectDragSource(content, { dropEffect: 'move' });
    // Connect as drop target
    content = this.props.connectDropTarget(content);
    // Connect to drag layer
    content = this.props.connectDragPreview(content);

    return content;
  }
}

Item.propTypes = {
  id: PropTypes.string.isRequired,
  listIdx: PropTypes.number.isRequired,
  name: PropTypes.string,

  // react-dnd props
  connectDragSource: PropTypes.func,
  connectDropTarget: PropTypes.func,
  connectDragPreview: PropTypes.func,
  onReorder: PropTypes.func,
  isDragging: PropTypes.bool,
  isOver: PropTypes.bool
};
