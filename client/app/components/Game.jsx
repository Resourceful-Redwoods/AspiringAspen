import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router';
import _ from 'lodash';

import game from './util/gameHelpers.js';

import Outcome from './Outcome.jsx';
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
        gameOver: false,
        opponentUsername: '',
        yourUsername: ''
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
          userCard: null,
          opponentCard: null,
          outcome: null,
          hasOutcome: null
        }
      }
    };
  }

  componentWillMount () {

  }

  componentDidMount() {
    this.props.socket.on('init', this._initialize);
    this.props.socket.on('hand', this._getHand.bind(this));
    // this.props.socket.on('card selected', this._getSelectedCard.bind(this));
    this.props.socket.on('category', this._getCategory.bind(this));
    this.props.socket.on('card played', this._getPlayedCard.bind(this));
    this.props.socket.on('round end', this._getRoundOutcome.bind(this));
    this.props.socket.on('game end', this._getGameOutcome.bind(this));
    this.props.socket.on('chat message', this._getChatMessage.bind(this));
    this.props.socket.on('opponent card'. this._setOpponentCard.bind(this));

    this.props.socket.on('opponent username'. this._setOpponentUsername.bind(this));

  }

  componentWillUnmount () {}

  _initialize() {}

  _getHand(hand) {
    console.log('from gethand', hand);
    var change = _.extend({}, this.state);
    change.board.userHand = hand;
    this.setState(change);
  }

  // _getSelectedCard(card) {
  //   console.log('from _getSelectedCard', card);
  //   var change = _.extend({}, this.state);
  //   change.board.userHand.selectedCard = card;
  //   this.setState(change);
  // }

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

  _setOpponentCard(card) {
    console.log('oppcard', card);
    var change = _.extend({}, this.state);
    change.board.currentRound.opponentCard = card;
    this.setState(change);
  }

  _setOpponentUsername(username) {
    // console.log('oppname', username);
    // var change = _.extend({}, this.state);
    // change.board.currentRound.opponentCard = card;
    // this.setState(change);
  }

  _getRoundOutcome(outcome) {
    console.log('from _getRoundOutcome', outcome);
    var change = _.extend({}, this.state);
    change.board.currentRound.outcome = outcome;
    change.board.isWaiting = false;
    change.board.currentRound.hasOutcome = true;
    this.setState(change);
    setTimeout(() =>
    this._outComeTimeOut()
    , 4000);
  }

  _outComeTimeOut() {
    console.log('timeout');
    var change = _.extend({}, this.state);
    change.board.currentRound.hasOutcome = false;
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

  _getChatMessage(data) {
    console.log('msg', data);
    var message = $('<li></li>');
    var messagecontent = $('<p>' + data.user + ': <br/> ' + data.message + ' </p>');
    message.append(messagecontent);
    $('#chat #messages').append(message);
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
    const hasOutCome = this.state.board.currentRound.hasOutcome;
    const thisOutcome = this.state.board.currentRound.outcome;
    const category = this.state.board.currentCategory;
    return (
     <div className='row'>
       <div className='game col s9'>
         <div className='center'>
          <OpponentHand
            currentHand={this.state.board.userHand.currentHand} />
          </div>
         <div id='board'>
          <div id='category'>
            <p>Current Category: { category }</p>
          </div>
          { this.state.board.isWaiting && !this.state.board.currentRound.outcome ? <p>Waiting for opponent...</p> : null }
          { hasOutCome ? <Outcome cat={category} outcome={thisOutcome} oppCard={this.state.board.userHand.selectedCard} userCard={this.state.board.userHand.selectedCard}/> : null }
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
       <div id='chat' className='sidebar col s3'>
          <ul id="messages"></ul>
          <div className="chat-input">
            <input id="m" autoComplete="off" /><button onClick={this.handleChatClick.bind(this)}>Send</button>
          </div>
        </div>
     </div>
    );
  }
}

export default Game;
