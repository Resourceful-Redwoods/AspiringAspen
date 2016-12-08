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
        playerA: {
          currentHand: [],
          username: null
        },
        playerB: {
          currentHand: [],
          username: null
        },
        waiting: false,
        currentRound: {
          playerACard: null,
          playerBCard: null,
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
       <div id-'board'><Board /></div>
       { gameOver ? <Decision winner={this.state.game.gameWinner} /> : null }
       <div id='userhand'><Userhand /></div>
     </div>
    )
  }
}
