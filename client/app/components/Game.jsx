import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

import game from './util/gameHelpers.js';

import Board from './Board.jsx';
import OpponentHand from './OpponentHand.jsx';
import Userhand from './Userhand.jsx';

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
<<<<<<< HEAD
          currentHand: {},
=======
          currentHand: {
            'Mike_Trout': {
              name: 'Mike Trout',
              info: {
                hr: 29,
                sb: 30,
                avg: 100,
                hits: 173,
                rbi: 100
              },
              imageUrl: 'http://a.espncdn.com/combiner/i?img=/i/headshots/mlb/players/full/30836.png&w=350&h=254'
            },
            'Joey_Votto': {
              name: 'Joey Votto',
              info: {
                hr: 29,
                sb: 8,
                avg: 326,
                hits: 181,
                rbi: 97
              },
              imageUrl: 'http://a.espncdn.com/combiner/i?img=/i/headshots/mlb/players/full/28670.png&w=350&h=254'
            }
          },
>>>>>>> gui
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
    change.game.gameWinner = outcome;
    change.game.gameOver = true;
    this.setState(change);
    console.log('gameOver', this.state.game.gameOver);
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

  render() {
    const gameOver = this.state.game.gameOver;

    return (
     <div className='game'>
       <div className='center'>
        <OpponentHand
          currentHand={this.state.board.userHand.currentHand} />
        </div>
       <div id='board'>
        <p>Current Category: { this.state.board.currentCategory }</p>
        { this.state.board.isWaiting && !this.state.board.currentRound.outcome ? <p>Waiting for opponent...</p> : null }
        { this.state.hasOutcome ? <Board /> : null }
        </div>
        { gameOver ? <GameOver winner={this.state.game.gameWinner} /> : null }
       <div className='center'>
        <Userhand
          currentHand={this.state.board.userHand.currentHand}
          selectCard={this.selectCard.bind(this)}
          playCard={this.playCard.bind(this)} />
        </div>
     </div>
    );
  }
}

export default Game;
