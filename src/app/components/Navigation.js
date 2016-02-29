import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import AppBar from 'react-toolbox/lib/app_bar';
import TooltipButton from './elements/TooltipButton';
import style from '../style';
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
      quit: <TooltipButton
        tooltip="Quit" onClick={quitApp} icon="power_settings_new" floating accent mini
      />
    };

    if (this.props.isAuthorized) {
      icons.logo = (
        <img
          className={style.logo}
          src="images/logo-light.png"
          onClick={this.openUrl}
        />
      );
      icons.logout = (
        <TooltipButton
          tooltip="Log out" onClick={this.logOut} icon="exit_to_app" floating accent mini
        />
      );
      if (location === '/feed') {
        icons.refresh = (
          <TooltipButton
            tooltip="Reload" onClick={this.props.fetchFeed}
            icon="refresh" floating accent mini
            className={cn({ [style.spin]: this.props.loading })}
          />
        );
        icons.settings = (
          <TooltipButton
            tooltip="Settings" onClick={this.openSettings} icon="settings" floating accent mini
          />
        );
      } else if (location === '/settings') {
        icons.back = (
          <TooltipButton
            tooltip="Back" onClick={this.goBack} icon="arrow_back" floating accent mini
          />
        );
      }
    }

    const actions = [
      { raised: true, icon: 'access_alarm', label: 'hi' },
      { raised: true, accent: true, icon: 'room' }
    ];

    return (
      <AppBar flat className={style.appbar}>
        {icons.logo}
        {icons.refresh}
        <div className={style.appnav}>
          {icons.back}
          {icons.settings}
          {icons.logout}
          {icons.quit}
        </div>
      </AppBar>
    );

    /*
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
    */
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
