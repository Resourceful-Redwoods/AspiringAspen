import React from 'react'
import ReactDOM from 'react-dom'

import 'Card' from './Card.jsx'

const UserHand = (props) => {

  const usersCards = props.currentHand.map((card) =>
    <Card cardInfo={card} />
  )

  return (
    <div>
      <p>{props.username}</p>
      <div>
        {usersCards}
      <div>
      <button onClick={props.playCard}>Play Card</button>
    </div>
  )
}

UserHand.propTypes = {
  currentHand: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired,
  playCard: PropTypes.func.isRequired,
};
