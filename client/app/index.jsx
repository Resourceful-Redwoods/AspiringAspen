import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router';

import App from './components/App.jsx';
import Home from './components/Home.jsx';
import Game from './components/Game.jsx';

render((
<div>
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />
      <Route path="/game" component={Game} />
    </Route>
  </Router>
</div>
), document.getElementById('root'));
