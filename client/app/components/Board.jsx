import React from 'react'
import ReactDOM from 'react-dom'

import Card from './Card.jsx'

const Board = (props) => {

  return (
    <div>
      <div className="user-hand">
        <p>Your Card:</p>
        <Card cardInfo={props.currentRound.userHandCard} />
      </div>

      <div className="opponent-hand">
        <p>Opponent Card:</p>
        <Card cardInfo={props.currentRound.opponentHandCard} />
      </div>

      <div>
        <p>{props.currentRound.outcome ? 'Outcome: ' + props.currentRound.outcome : null}</p>
      </div>
    </div>
  )
}

Board.propTypes = {
};
