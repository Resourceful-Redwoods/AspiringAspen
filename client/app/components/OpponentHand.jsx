import React from 'react'
import ReactDOM from 'react-dom'

import Cardback from './Card.jsx'

const OpponentHand = (props) => {

  const usersCards = props.currentHand.map((card) =>
    <Cardback />
  )

  return (
    <div>
      {usersCards}
    </div>
  )
}

// OpponentHand.propTypes = {
//   currentHand: PropTypes.array.isRequired,
// };

export default OpponentHand;