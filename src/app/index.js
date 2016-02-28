import 'babel-polyfill';
import './style';
import React from 'react';
import { render } from 'react-dom';
import Root from './containers/Root';
import configureStore from './store/configureStore';

configureStore(store => {
  render(
    <Root store={store}/>,
    document.getElementById('root')
  );
});
