import React from 'react';
import ReactDOM from 'react-dom';

const Card = (props) => {
  // receives the selectCard prop from game which sets the current card

  return (

    <div className='cardFront hoverable center-block' onClick={() => props.selectCard(props.card)}>
      <div className='cardFrontWrapper'>
        <img className='circle' src={props.card.imageUrl}></img>
        <div className='statsWrapper left-align'>
          <p>{props.card.name}</p>
          <ul>
            <li>Home Runs: {props.card.info.hr}</li>
            <li>Average: {props.card.info.avg}</li>
            <li>Hits: {props.card.info.hits}</li>
            <li>RBI: {props.card.info.rbi}</li>
            <li>Stolen Bases: {props.card.info.sb}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Card;
