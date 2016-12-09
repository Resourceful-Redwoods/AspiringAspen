import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Link, hashHistory } from 'react-router'

import Home from './components/Home.jsx'
import Game from './components/Game.jsx'

render((
  <Router history={hashHistory}>
    <Route path="/" component={Home}/>
    <Route path="/game" component={Game}/>
  </Router>
), document.getElementById('root'));
