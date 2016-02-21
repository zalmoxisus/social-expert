import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { login, logout } from '../actions/api';
import GoMarkGithub from 'react-icons/lib/go/mark-github';

export default class LoginPage extends Component {
  render() {
    return (
      <div className="container-fluid main-container login">
        <div className="row">
          <div className="col-xs-offset-1 col-xs-10">
            <img className="img-responsive logo" src="images/logo-big.png" />
            <div className="desc">Log in via GitHub to get access to your notifications.</div>
            <button className="btn btn-default btn-lg btn-block" onClick={this.props.login}>
              <GoMarkGithub/> Log in to GitHub
            </button>
          </div>
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  login: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    login: () => {
      dispatch(login.request('github'));
    }
  };
}

export default connect(undefined, mapDispatchToProps)(LoginPage);
