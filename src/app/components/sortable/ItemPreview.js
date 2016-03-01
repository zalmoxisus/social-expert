// Based on https://github.com/yahoo/react-dnd-touch-backend/tree/master/examples

import React, { Component, PropTypes } from 'react';
import DragLayer from 'react-dnd/lib/DragLayer';
import style from './style';

function collect(monitor) {
  const item = monitor.getItem();
  return {
    id: item && item.id,
    name: item && item.name,
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging()
  };
}

function getItemStyles(currentOffset) {
  if (!currentOffset) {
    return {
      display: 'none'
    };
  }

  // http://www.paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/
  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;

  return {
    pointerEvents: 'none',
    transform,
    WebkitTransform: transform
  };
}

@DragLayer(collect)
export default class ItemPreview extends Component {
  render() {
    if (!this.props.isDragging) {
      return null;
    }

    return (
      <div
        className={style.cardPreview}
        style={getItemStyles(this.props.currentOffset)}
      >
        {this.props.name}
      </div>
    );
  }
}

ItemPreview.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  currentOffset: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  isDragging: PropTypes.bool
};
