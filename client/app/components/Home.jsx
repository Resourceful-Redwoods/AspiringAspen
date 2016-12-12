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
      username: '',
      hasUsername: false,
      showForm: true
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
    this.props.socket.emit('set username', this.state.username);
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

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
    this.setState({ hasUsername: true });
    console.log('user', this.state.username);
  }

  handleUsername(e) {
    e.preventDefault();
    if ( this.state.username !== '' ) {
      console.log(this.state.username);
      this.setState({ hasUsername: true, showForm: false });
      this.props.socket.emit('set username', this.state.username);
    }
  }

  render() {
    let gameState = this.state.gameState;
    return (
      <div id='home' className='wrapper'>
        <div className='row'>
          <div className="titlebar col s12">
            <h1>DECK</h1>
            <img className='cardIcon' src='img/cardIcon.svg'></img>
          </div>
        </div>
        { gameState === 'waiting' ? <Waiting cancelMatchmaking={this.cancelMatchmaking.bind(this)} /> : null }
        <div className='row lower'>
          <div id='' className='col s12'>
          <h1>STOMP</h1>
            <div className='center-block nameForm'>
              { this.state.showForm ? (
              <form>
                <label>
                  Enter a name:
                  <input type="text" name="name" onChange={this.handleUsernameChange.bind(this)}/>
                </label>
                
              </form>
              ) : <p>Welcome {this.state.username}!</p> }
            </div>
            { this.state.hasUsername ? <button onClick={ this.playNow.bind(this) }>PLAY <img src='img/playBtn.svg'></img> </button> : null }
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
