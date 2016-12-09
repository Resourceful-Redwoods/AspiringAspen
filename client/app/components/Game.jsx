import React from 'react'
import ReactDOM from 'react-dom'

import game from './util/gameHelpers.js'

import Board from './Board.jsx'
import OpponentHand from './OpponentHand.jsx'
import Userhand from './Userhand.jsx'

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
          currentHand: {
            'Mike_Trout': {
              name: 'Mike Trout',
              info: {
                hr: 29,
                sb: 30,
                avg: 100,
                hits: 173,
                rbi: 100
              }
            },
            'Joey_Votto': {
              name: 'Joey Votto',
              info: {
                hr: 29,
                sb: 8,
                avg: 326,
                hits: 181,
                rbi: 97
              }
            }
          },
          selectedCard: null,
          username: null
        },
        opponentHand: {
          currentHand: {
            'Nolan_Arenado': {
              name: 'Nolan Arenado',
              info: {
                hr: 41,
                sb: 2,
                avg: 294,
                hits: 182,
                rbi: 133
              }
            },
            'Mookie_Betts': {
              name: 'Mookie_Betts',
              info: {
                hr: 31,
                sb: 26,
                avg: 318,
                hits: 214,
                rbi: 113
              }
            }
          },
          username: null
        },
        waiting: false,
        currentRound: {
          userHandCard: null,
          opponentHandCard: null,
          outcome: null
        }
      }
    }
  }

  componentWillMount () {
    // game.assignHands();
    // get deck
  }

  componentDidMount() {
    socket.on('init', this._initialize);
  }

  componentWillUnmount () {

  }

  selectCard(card) {
    console.log('select card', card)
    // emit to socket
      // send card along with the username
  }

  playCard() {
    console.log('play card', this.state)
    socket.emit('send:message', message)
    // emit to socket
  }

  render() {
    const gameOver = this.state.game.gameOver;

    return (
     <div>
       <div id='opponent'>
        <OpponentHand
          currentHand={this.state.board.opponentHand.currentHand} />
        </div>
       <div id='board'>
        { this.state.board.currentRound.userHandCard && this.state.board.currentRound.opponentHandCard ? <Board /> : null}
        </div>
       { gameOver ? <GameOver winner={this.state.game.gameWinner} /> : null }
       <div id='userhand'>
        <Userhand
          currentHand={this.state.board.userHand.currentHand}
          selectCard={this.selectCard}
          playCard={this.playCard} />
        </div>
     </div>
    )
  }
}

export default Game;