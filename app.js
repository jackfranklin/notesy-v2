import {
  browserHistory,
  Router,
  Route,
  IndexRoute
} from 'react-router';

import { render } from 'react-dom';

import App from './components/app';
import React from 'react';

render((
  <Router history={browserHistory}>
    <Route path="/(:documentId)" component={App} />
  </Router>
), document.getElementById('app'));


