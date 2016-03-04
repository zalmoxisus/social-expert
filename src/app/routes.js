import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import App from './components/App';
import NotFound from './components/NotFound';
import Feed from './components/feed/Feed';
import Settings from './components/settings/Settings';
import Sortable from './components/settings/sortable/Sortable';
import Update from './components/settings/Update';
import LoginPage from './components/LoginPage';

export default (
  <Route component={App}>
    <Redirect from="/" to="/feed" />
    <Route path="/feed" component={Feed} />
    <Route path="/settings" component={Settings}>
      <IndexRoute component={Sortable} />
      <Route path="targets" component={Sortable} />
      <Route path="update" component={Update} />
    </Route>
    <Route path="/login" component={LoginPage} />
    <Route path="*" component={NotFound} />
  </Route>
);
