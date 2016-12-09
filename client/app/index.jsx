import React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, IndexRoute, hashHistory } from 'react-router';

import App from './components/App.jsx';
import Home from './components/Home.jsx';
import Game from './components/Game.jsx';

let socket = io();

$('body').on('submit', '#chatBox', function(e){
  e.preventDefault();
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
});
$('body').on('click', '#chat', function() {
  socket.emit('game', 'play');
});
socket.on('chat message', function(msg){
  $('#test #messages').append($('<li>').text(msg));
});
socket.on('disconnect', function() {
  console.log('***DISCONNECTED***');
})
socket.on('game end', function(msg) {
  console.log(msg);
});
socket.on('category', function(category) {
  console.log(category);
});

render((
<div>
  <Router history={hashHistory}>
    <Route path="/" component={App} >
      <IndexRoute component={Home} />
      <Route path="/game" component={Game} />
    </Route>
  </Router>
  <div id="test">
    <button id="chat">Chat!</button>
    <ul id="messages"></ul>
    <form action="" id="chatBox">
    <input id="m" autoComplete="off" /><button>Send</button>
    </form>
  </div>
</div>
), document.getElementById('root'));
