import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router';
import _ from 'lodash';

import Outcome from './Outcome.jsx';
import OpponentHand from './OpponentHand.jsx';
import Userhand from './Userhand.jsx';
import GameOver from './GameOver.jsx';

// functions with a _ in front are functions that are done due to an action from the server

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      game: {
        rounds: {
          totalNum: 0,
          userWins: 0,
          opponentWins: 0
        },
        gameWinner: null,
        gameOver: false,
        opponentUsername: ''
      },
      board: {
        currentCategory: JSON.stringify({name: 'loading'}),
        inGame: false,
        userHand: {
          currentHand: {},
          selectedCard: null,
          username: null
        },
        opponentHandLength: 0,
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

  componentDidMount() {
    this.props.socket.on('hand', this._getHand.bind(this));
    this.props.socket.on('category', this._getCategory.bind(this));
    this.props.socket.on('card played', this._getPlayedCard.bind(this));
    this.props.socket.on('round end', this._getRoundOutcome.bind(this));
    this.props.socket.on('game end', this._getGameOutcome.bind(this));
    this.props.socket.on('chat message', this._getChatMessage.bind(this));
    this.props.socket.on('opponent card', this._setOpponentCard.bind(this));
    this.props.socket.on('opponent username', this._setOpponentUsername.bind(this));
  }

  _getHand(hand) {
    // gets the hand from the server and sets the state with it
    // we have to use extend so that we can easily change a nested state
    var change = _.extend({}, this.state);
    change.board.userHand = hand;
    change.board.opponentHandLength = Object.keys(hand.currentHand).length;
    this.setState(change);
  }

  _getCategory(cat) {
    // gets the current category from the server and sets the state with it
    var change = _.extend({}, this.state);
    change.board.currentCategory = cat;
    this.setState(change);
  }

  _getPlayedCard() {
    // get confirmation of the played card and changes state so that the player is waitings
    var change = _.extend({}, this.state);
    change.board.isWaiting = true;
    this.setState(change);
  }

  _setOpponentCard(card) {
    // get opponent card from server and set state with ita
    var change = _.extend({}, this.state);
    change.board.currentRound.opponentCard = card;
    this.setState(change);
  }

  _setOpponentUsername(username) {
    // set opponents username
    var change = _.extend({}, this.state);
    change.game.opponentUsername = username;
    this.setState(change);
  }

  _getRoundOutcome(outcome) {
    // get round outcome from server
    var change = _.extend({}, this.state);
    change.board.currentRound.outcome = outcome;
    if ( outcome === 'You were outmatched and defeated.' ) {
      change.game.rounds.opponentWins = change.game.rounds.opponentWins + 1;
    } else if (outcome === 'tie') {
      // tie is like loss but with random reasoning. If the outcomes is tie, it means the cards matched and the server randomly picked a winner...and this one is not it.
      change.board.currentRound.outcome = 'While evenly matched the Universe was against you. You Lose.';
      change.game.rounds.opponentWins = change.game.rounds.opponentWins + 1;
    } else {
      change.game.rounds.userWins = change.game.rounds.userWins + 1;
    }
    change.board.opponentHandLength = change.board.opponentHandLength - 1;
    change.board.isWaiting = false;
    change.board.currentRound.hasOutcome = true;
    this.setState(change);
    // onlny show the outcome for 4 seconds
    setTimeout(() =>
      this._outComeTimeOut()
    , 4000);
  }

  _outComeTimeOut() {
    // remove outcome display
    var change = _.extend({}, this.state);
    change.board.currentRound.hasOutcome = false;
    this.setState(change);
  }

  _getGameOutcome(outcome) {
    // get game outcome from server and indicate winner/loser
    var change = _.extend({}, this.state);
    change.game.gameWinner = outcome.toString();
    change.game.gameOver = true;
    setTimeout(() =>
      this.setState(change)
    , 4000);
  }

  _getChatMessage(data) {
    // get the chat message from the server
    var message = $('<li class="message"></li>');

    var username = socket.id === data.user ? 'me' : this.state.game.opponentUsername;
    // Why is opponentUsername showing up as guest?

    var usernameContent = $('<strong></strong>');
    usernameContent.text(username);

    var messageContent = $('<span></span>');
    messageContent.text(data.message);

    var messageOutput = $('<p></p>');
    messageOutput.append(usernameContent).append('<br />').append(messageContent);

    message.append(messageOutput);

    if (username !== 'me') {
      message.addClass('right-align');
    }

    $('#chat #messages').prepend(message);
    // This would allow the chat box to automatically scroll, but it is not working...
    // $('.messages-container').scrollTop($(this).height());
  }

  selectCard(card) {
    // save selected card in state
    var change = _.extend({}, this.state);
    change.board.userHand.selectedCard = card;
    this.setState(change);
  }

  playCard() {
    if ( this.state.board.isWaiting === true ) {
      // if player is waiting, they are not allowed to play another card
      return;
    }
    // send palyed card to server
    var playedCard = this.state.board.userHand.selectedCard.name;
    this.props.socket.emit('play card', playedCard);
    var change = _.extend({}, this.state);
    // remove card from hand
    delete change.board.userHand.currentHand[playedCard];
    // update state so that the removed card is not in state
    this.setState(change);
  }

  exitGame() {
    // allow a user to go back to home screen
    this.props.router.push('/');
  }

  handleChatClick(e) {
    // when a user adds a message
    e.preventDefault();
    if ( $('#m').val() !== '' ) {
      this.props.socket.emit('chat message', $('#m').val());
    }
    $('#m').val('');
    return false;
  }

  handleChatSubmit(e) {
    // when a user adds a message
    e.preventDefault();
    if ( $('#m').val() !== '' ) {
      this.props.socket.emit('chat message', $('#m').val());
    }
    $('#m').val('');
    return false;
  }

  render() {
    const gameOver = this.state.game.gameOver;
    const hasOutCome = this.state.board.currentRound.hasOutcome;
    const thisOutcome = this.state.board.currentRound.outcome;
    const category = this.state.board.currentCategory;
    console.log(category);
    return (
     <div className='row'>
       <div className='game col s9'>
         <div className='center'>
          <OpponentHand
            currentHandLength={this.state.board.opponentHandLength} username={this.state.game.opponentUsername} />
          </div>
         <div id='board'>
          <div id='category'>
            <p>
              Battle Location: { JSON.parse(category).name }<br />
              Score: You {this.state.game.rounds.userWins} | Opponent {this.state.game.rounds.opponentWins}
            </p>
          </div>
          { this.state.board.isWaiting && !this.state.board.currentRound.outcome ? <p className='oppWaiting flash'>Waiting for opponent...</p> : null }
          { hasOutCome ? <Outcome cat={JSON.parse(category).name} outcome={thisOutcome} oppCard={this.state.board.currentRound.opponentCard} userCard={this.state.board.userHand.selectedCard}/> : null }
          </div>
          { gameOver ? <GameOver exitGame={this.exitGame.bind(this)} winner={this.state.game.gameWinner}/> : null }
         <div className='center'>
          <Userhand
            currentHand={this.state.board.userHand.currentHand}
            selectCard={this.selectCard.bind(this)}
            currentSelectedCard={this.state.board.userHand.selectedCard}
            playCard={this.playCard.bind(this)}
            disabled={this.state.board.isWaiting} />
          </div>
       </div>
       <div id='chat' className='sidebar col s3'>
         <div className="messages-container">
           <ul id="messages" className='message-list'></ul>
         </div>
         <div className="chat-form-container">
           <form className="chat-input" onSubmit={this.handleChatSubmit.bind(this)}>
             <input id="m" autoComplete="off" /><button onClick={this.handleChatClick.bind(this)}>Send</button>
           </form>
         </div>
        </div>
     </div>
    );
  }
}

export default Game;
