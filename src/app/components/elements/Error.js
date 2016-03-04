import React, { Component, PropTypes } from 'react';
import { toastr } from 'react-redux-toastr';
import FontIcon from 'react-toolbox/lib/font_icon';
import style from '../../style';

export default class Error extends Component {
  componentDidMount() {
    const error = this.props.error;
    if (error && error.indexOf('Unauthorized url') !== -1) {
      toastr.confirm('It seems that your authorization expired. Relogin?', {
        onOk: () => { this.context.router.push('/login'); }
      });
    }
  }

  render() {
    return (
      <div className={style.errored}>
        <h3>Oops. Something went wrong.</h3>
        <h2>Please try again later.</h2>
        <FontIcon value="error_outline" className={style.iconBig}/>
      </div>
    );
  }
}

Error.contextTypes = {
  router: PropTypes.object.isRequired
};

Error.propTypes = {
  error: PropTypes.string.isRequired
};
