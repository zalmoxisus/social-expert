import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import NotFound from './components/NotFound';
import Feed from './components/Feed';
import LoginPage from './components/LoginPage';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Feed} />
    <Route path="/feed" component={Feed} />
    <Route path="/login" component={LoginPage} />
    <Route path="*" component={NotFound} />
  </Route>
);
