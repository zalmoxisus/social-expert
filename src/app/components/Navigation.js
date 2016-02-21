import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import MdRefresh from 'react-icons/lib/md/refresh';
import GoSignOut from 'react-icons/lib/go/sign-out';
import FaPowerOff from 'react-icons/lib/fa/power-off';
import { openUrl, quitApp, updateTrayIcon } from '../services/electron';
import { logout, fetchFeed } from '../actions/api';
import { isPending } from '../utils/createReducer';

class Navigation extends Component {
  logOut() {
    this.props.logout();
    this.context.router.push('/login');
    updateTrayIcon();
  }

  openUrl() {
    openUrl('https://github.com/zalmoxisus/social-expert');
  }

  render() {
    let icons = {
      quit: <span title="Quit" className="ico" onClick={quitApp}><FaPowerOff/></span>
    };

    if (this.props.location.pathname !== '/login') {
      icons.logo = (
        <img
          className="img-responsive logo"
          src="images/logo-light.png"
          onClick={this.openUrl}
        />
      );
    }

    if (this.props.isAuthorized && this.props.location.pathname === '/feed') {
      icons = {
        ...icons,
        refresh: (
          <span
            title="Reload"
            className={this.props.loading ? 'ico spin' : 'ico'}
            onClick={this.props.fetchFeed}
          >
            <MdRefresh/>
          </span>
        ),
        logout: <span title="Log out" className="ico" onClick={::this.logOut}><GoSignOut/></span>
      };
    }

    return (
      <div className="container-fluid">
        <div className="row navigation">
          <div className="col-xs-6 left">
            {icons.logo}
            {icons.refresh}
          </div>
          <div className="col-xs-6 right">
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
  isAuthorized: !!state.auth.github,
  loading: isPending(state.feed.status)
});

const mapDispatchToProps = dispatch => ({
  logout: () => { dispatch(logout()); },
  fetchFeed: () => { dispatch(fetchFeed.request()); }
});

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);
