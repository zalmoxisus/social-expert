import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { login, logout } from '../actions/api';
import { Button } from 'react-toolbox/lib/button';
import GoMarkGithub from 'react-icons/lib/go/mark-github';
import style from '../style';

export default class LoginPage extends Component {
  render() {
    return (
      <div className={style.login}>
        <img className={style.logo} src="images/logo-big.png" />
        <div className={style.desc}>Log in via GitHub to get access to your notifications.</div>
        <Button className={style.button} onClick={this.props.login} raised>
          <GoMarkGithub/> Log in to GitHub
        </Button>
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
