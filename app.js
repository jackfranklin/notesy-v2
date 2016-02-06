import {
  browserHistory,
  Router,
  Route,
  IndexRoute
} from 'react-router';

import { render } from 'react-dom';

import App from './components/app';
import Index from './components/index';
import React from 'react';

render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Index} />
    </Route>
  </Router>
), document.getElementById('app'));


