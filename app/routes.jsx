/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import JiraFormPage from './containers/JiraFormPage';

export default () => (
  <App>
    <Switch>
      <Route path="/jira" component={JiraFormPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
