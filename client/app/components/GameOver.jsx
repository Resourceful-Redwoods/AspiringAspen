import React from 'react'
import ReactDOM from 'react-dom'



// displays gameover screen, winner of round, exit button


class GameOver extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      winner: null
    }
  }


  render() {
    return (
      <div>
        <h1>Game Over</h1>
        <h2>Winner: {this.state.winner}</h2>

        <button>Exit</button>
      </div>
      )
  }
}
