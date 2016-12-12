import React from 'react';
import ReactDOM from 'react-dom';

const Card = (props) => {
  // receives the selectCard prop from game which sets the current card

  return (

    <div className='cardFront hoverable center-block' onClick={() => props.selectCard(props.card)}>
      <img src={props.card.imageUrl}></img>
      <div className='statsWrapper left-align'>
        <p>{props.card.name}</p>
        <p>Stats</p>
        <ul>
          <li>Home Runs: {props.card.info['Home Runs']}</li>
          <li>Average: {props.card.info.Average}</li>
          <li>Hits: {props.card.info.Hits}</li>
          <li>RBI: {props.card.info.RBI}</li>
          <li>Stolen Bases: {props.card.info['Stolen Bases']}</li>
        </ul>
      </div>
    </div>
  );
};

export default Card;
