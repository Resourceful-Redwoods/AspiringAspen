import React from 'react';
import ReactDOM from 'react-dom';

const Card = (props) => {
  return (
    <div className='cardFront hoverable center-block' onClick={() => props.selectCard(props.card)}>
      <div className='cardFrontWrapper'>
        <img className='circle' src={git stprops.card.imageUrl}></img>
        <div className='statsWrapper left-align'>
          <p>{props.card.name}</p>
          <ul>
            <li>Home Runs: {props.card.info['Home Runs']}</li>
            <li>Average: {props.card.info['Average']}</li>
            <li>Hits: {props.card.info['Hits']}</li>
            <li>RBI: {props.card.info['RBI']}</li>
            <li>Stolen Bases: {props.card.info['Stolen Bases']}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Card;
