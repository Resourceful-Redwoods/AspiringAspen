import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router';

import Waiting from './Waiting.jsx';
import Game from './Game.jsx';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameState: 'idle',
    };
  }

  componentDidMount () {
    this.props.socket.on('init', this._initialize);
    // listen to see if there is a match
    this.props.socket.on('enter game', this._enterGame.bind(this));
  }

  componentWillUnmount() {}

  _initialize() {
    // do things right away
  }

  _enterGame() {
    console.log(this);
    this.props.router.push('/game');
  }

  playNow () {
    console.log('play now');
    this.setState({ gameState: 'waiting' });
    this.props.socket.emit('game', 'play');
    // gamestate is waiting
  }

  cancelMatchmaking () {
    console.log('cancel looking');
    this.setState({ gameState: 'idle' });
    this.props.socket.emit('game', 'cancel');
    // gameState is idle, emit it back to server
  }

  render() {
    let gameState = this.state.gameState;
    return (
      <div>
        <div className="titlebar">
          <h1>DeckStomp</h1>
        </div>
        { gameState === 'waiting' ? <Waiting cancelMatchmaking={this.cancelMatchmaking.bind(this)} /> : null }
        <div>
          <form id='nameForm'>
            <label>
              Enter a name:
              <input type="text" name="name" />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <button onClick={ this.playNow.bind(this) }> Play Now! </button>
        </div>
      </div>
    );
  }
}

export default Home;