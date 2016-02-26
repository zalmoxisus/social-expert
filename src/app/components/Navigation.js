import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import MdRefresh from 'react-icons/lib/md/refresh';
import MdSignOut from 'react-icons/lib/md/exit-to-app';
import MdPower from 'react-icons/lib/md/power-settings-new';
import MdSettings from 'react-icons/lib/md/settings';
import MdArrowBack from 'react-icons/lib/md/arrow-back';
import { openUrl, quitApp, updateTrayIcon } from '../services/electron';
import { logout, fetchFeed } from '../actions/api';
import { isPending } from '../utils/createReducer';

class Navigation extends Component {
  logOut = () => {
    this.props.logout();
    this.context.router.push('/login');
    updateTrayIcon();
  };

  openSettings = () => {
    this.context.router.push('/settings');
  };

  goBack = () => {
    this.context.router.push('/feed');
  };

  openUrl() {
    openUrl('https://github.com/zalmoxisus/social-expert');
  }

  render() {
    const location = this.props.location.pathname;
    let icons = {
      quit: <span title="Quit" className="ico" onClick={quitApp}><MdPower/></span>
    };

    if (this.props.isAuthorized) {
      icons.logo = (
        <img
          className="img-responsive logo"
          src="images/logo-light.png"
          onClick={this.openUrl}
        />
      );
      icons.logout = (
        <span title="Log out" className="ico" onClick={this.logOut}><MdSignOut/></span>
      );
      if (location === '/feed') {
        icons.refresh = (
          <span
            title="Reload"
            className={this.props.loading ? 'ico spin' : 'ico'}
            onClick={this.props.fetchFeed}
          >
            <MdRefresh/>
          </span>
        );
        icons.settings = (
          <span title="Settings" className="ico" onClick={this.openSettings}><MdSettings/></span>
        );
      } else if (location === '/settings') {
        icons.back = (
          <span title="Back" className="ico" onClick={this.goBack}><MdArrowBack/></span>
        );
      }
    }

    return (
      <div className="container-fluid">
        <div className="row navigation">
          <div className="col-xs-6 left">
            {icons.logo}
            {icons.refresh}
          </div>
          <div className="col-xs-6 right">
            {icons.back}
            {icons.settings}
            {icons.logout}
            {icons.quit}
          </div>
        </div>
      </div>
    );
  }
}

Navigation.contextTypes = {
  router: PropTypes.object.isRequired
};

Navigation.propTypes = {
  location: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired,
  fetchFeed: PropTypes.func.isRequired,
  isAuthorized: PropTypes.bool,
  loading: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthorized: state.auth.has('github'),
  loading: isPending(state.feed.get('status'))
});

const mapDispatchToProps = dispatch => ({
  logout: () => { dispatch(logout()); },
  fetchFeed: () => { dispatch(fetchFeed.request()); }
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
