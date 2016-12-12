import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router';
import _ from 'lodash';

import game from './util/gameHelpers.js';

import Board from './Board.jsx';
import OpponentHand from './OpponentHand.jsx';
import Userhand from './Userhand.jsx';
import GameOver from './GameOver.jsx';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      game: {
        rounds: {
          totalNum: 0,
          playerAWins: 0,
          playerBWins: 0
        },
        gameWinner: null,
        gameOver: false
      },
      board: {
        currentCategory: null,
        userHand: {
          currentHand: {},
          selectedCard: null,
          username: null
        },
        isWaiting: false,
        currentRound: {
          userHandCard: null,
          opponentHandCard: null,
          outcome: null
        }
      }
    };
  }

  componentWillMount () {

  }

  componentDidMount() {
    this.props.socket.on('init', this._initialize);
    this.props.socket.on('hand', this._getHand.bind(this));
    this.props.socket.on('card selected', this._getSelectedCard.bind(this));
    this.props.socket.on('category', this._getCategory.bind(this));
    this.props.socket.on('card played', this._getPlayedCard.bind(this));
    this.props.socket.on('round end', this._getRoundOutcome.bind(this));
    this.props.socket.on('game end', this._getGameOutcome.bind(this));
    this.props.socket.on('chat message', this._getChatMessage.bind(this));

  }

  componentWillUnmount () {}

  _initialize() {}

  _getHand(hand) {
    console.log('from gethand', hand);
    var change = _.extend({}, this.state);
    change.board.userHand = hand;
    this.setState(change);
  }

  _getSelectedCard(card) {
    console.log('from _getSelectedCard', card);
    var change = _.extend({}, this.state);
    change.board.userHand.selectedCard = card;
    this.setState(change);
  }

  _getCategory(cat) {
    console.log('from _getCategory', cat);
    var change = _.extend({}, this.state);
    change.board.currentCategory = cat;
    this.setState(change);
  }

  _getPlayedCard() {
    console.log('from _getPlayedCard');
    var change = _.extend({}, this.state);
    change.board.isWaiting = true;
    this.setState(change);
    // should remove from hand
    // render to board
  }

  _getRoundOutcome(outcome) {
    console.log('from _getRoundOutcome', outcome);
    var change = _.extend({}, this.state);
    change.board.currentRound.outcome = outcome;
    change.board.isWaiting = false;
    this.setState(change);
  }

  _getGameOutcome(outcome) {
    console.log('from _getGameOutcome', outcome);
    var change = _.extend({}, this.state);
    change.game.gameWinner = outcome.toString();
    change.game.gameOver = true;
    this.setState(change);
    console.log('gameOver', this.state.game.gameOver);
  }

  _getChatMessage(msg) {
    $('#test #messages').append($('<li>').text(msg));
  }

  selectCard(card) {
    console.log('select card', card);
    // save selected card in state
    var change = _.extend({}, this.state);
    change.board.userHand.selectedCard = card;
    this.setState(change);
    // this.props.socket.emit('select card', card);
  }

  playCard() {
    if ( this.state.board.isWaiting === true ) {
      return;
    }
    console.log('play card', this.state.board.userHand.selectedCard);
    // socket.emit('play card', this.state.selectedCard);
    // set isWaiting to true
    var playedCard = this.state.board.userHand.selectedCard.name;
    this.props.socket.emit('play card', playedCard);
    var change = _.extend({}, this.state);
    delete change.board.userHand.currentHand[playedCard];
    console.log(change.board.userHand);
    this.setState(change);

  }

  exitGame() {
    this.props.socket.emit('game exit');
    this.props.router.push('/');
  }

  handleChatClick(e) {
    e.preventDefault();
    this.props.socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  }

  render() {
    const gameOver = this.state.game.gameOver;

    return (
     <div className='row'>
       <div className='game col s9'>
         <div className='center'>
          <OpponentHand
            currentHand={this.state.board.userHand.currentHand} />
          </div>
         <div id='board'>
          <p>Current Category: { this.state.board.currentCategory }</p>
          { this.state.board.isWaiting && !this.state.board.currentRound.outcome ? <p>Waiting for opponent...</p> : null }
          { this.state.hasOutcome ? <Board /> : null }
          </div>
          { gameOver ? <GameOver exitGame={this.exitGame.bind(this)} winner={this.state.game.gameWinner}/> : null }
         <div className='center'>
          <Userhand
            currentHand={this.state.board.userHand.currentHand}
            selectCard={this.selectCard.bind(this)}
            playCard={this.playCard.bind(this)}
            disabled={this.state.board.isWaiting} />
          </div>
       </div>
       <div id='test' className='sidebar col s3'>
          <button id="chat">Chat!</button>
          <ul id="messages"></ul>
          <form action="" id="chatBox">
          <input id="m" autoComplete="off" /><button onClick={this.handleChatClick.bind(this)}>Send</button>
          </form>
        </div>
     </div>
    );
  }
}

export default Game;
