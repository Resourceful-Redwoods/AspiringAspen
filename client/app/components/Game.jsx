import React from 'react'
import ReactDOM from 'react-dom'
import game from './util/gameHelper.js'

import Board from './Board.jsx'
import Opponent from './Opponent.jsx'
import Submit from './Submit.jsx'
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
          currentHand: [
            {
              name: 'Mike Trout',
              info: {
                hr: 29,
                sb: 30,
                avg: 100,
                hits: 173,
                rbi: 100
              }
            },
            {
              name: 'Joey Votto',
              info: {
                hr: 29,
                sb: 8,
                avg: 326,
                hits: 181,
                rbi: 97
              }
            }
          ],
          selectedCard: null,
          username: null
        },
        opponentHand: {
          currentHand: [
            {
              name: 'Nolan Arenado',
              info: {
                hr: 41,
                sb: 2,
                avg: 294,
                hits: 182,
                rbi: 133
              }
            },
            {
              name: 'Mookie Betts',
              info: {
                hr: 31,
                sb: 26,
                avg: 318,
                hits: 214,
                rbi: 113
              }
            }
          ],
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
    game.assignHands();
    //get deck
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render() {
    const gameOver = this.state.game.gameOver;
    return (
     <div>
       <div id='opponent'><Opponent /></div>
       <div id-'board'><Board currentRound={this.state.currentRound} /></div>
       { gameOver ? <Decision /> : null }
       <div id='userhand'><Userhand /></div>
     </div>
    )
  }
}
