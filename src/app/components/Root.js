import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from '../routes';

export default class Root extends Component {
  constructor(props) {
    super(props);
    this.history = syncHistoryWithStore(hashHistory, this.props.store);
  }
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <div className="rootContainer">
          <Router history={this.history} routes={routes} />
          <ReduxToastr />
        </div>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
};
