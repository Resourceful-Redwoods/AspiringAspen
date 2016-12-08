import React from 'react'
import ReactDOM from 'react-dom'

const Card = (props) => {
  return (
    <div onClick={props.selectCard(this)}>
      <p>Player: {props.cardInfo.name}</p>
      <p>Stats</p>
      <ul>
        <li>Home Runs: {props.cardInfo.hr}</li>
        <li>Average: {props.cardInfo.avg}</li>
        <li>Hits: {props.cardInfo.hits}</li>
        <li>RBI: {props.cardInfo.rbi}</li>
        <li>Stolen Bases: {props.cardInfo.sb}</li>
      </ul>
    </div>
  )
}

Card.propTypes = {
  cardInfo: PropTypes.object.isRequired,
  selectCard: PropTypes.func.isRequired,
};
