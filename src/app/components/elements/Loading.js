import React, { Component, PropTypes } from 'react';
import ProgressBar from 'react-toolbox/lib/progress_bar';
import Reloading from 'reloading';
import style from '../../style';

export default class Loading extends Component {
  shouldComponentUpdate(nextProps) {
    return this.props.shouldShow !== nextProps.shouldShow;
  }

  render() {
    return (
      <Reloading className={style.loadingContainer} shouldShow={this.props.shouldShow}>
        <div className={style.loadingText}>{this.props.loadingText}</div>
        <ProgressBar className={style.progress} type="circular" mode="indeterminate" multicolor />
      </Reloading>
    );
  }
}

Loading.propTypes = {
  shouldShow: PropTypes.any,
  loadingText: PropTypes.string
};
