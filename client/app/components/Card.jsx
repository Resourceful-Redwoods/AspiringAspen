import React from 'react'
import ReactDOM from 'react-dom'

const Card = (props) => {
  console.log('card', props)

  return (

    <div onClick={() => props.selectCard(props.card)}>
      <p>Player: {props.card.name}</p>
      <p>Stats</p>
      <ul>
        <li>Home Runs: {props.card.info.hr}</li>
        <li>Average: {props.card.info.avg}</li>
        <li>Hits: {props.card.info.hits}</li>
        <li>RBI: {props.card.info.rbi}</li>
        <li>Stolen Bases: {props.card.info.sb}</li>
      </ul>
    </div>
  )
}

// Card.propTypes = {
//   card: React.PropTypes.object,
//   selectCard: React.PropTypes.func
// };

export default Card;