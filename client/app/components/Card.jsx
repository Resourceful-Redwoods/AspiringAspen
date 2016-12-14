import React from 'react';
import ReactDOM from 'react-dom';

const Card = (props) => {
  console.log(props);
  return (
    <div className={props.currentSelectedCard === props.card ? 'selected-card cardFront hoverable center-block' : 'cardFront hoverable center-block'} onClick={() => props.selectCard(props.card)}>
      <div className='cardFrontWrapper'>
        <img className='circle' src={props.card.image}></img>
        <div className='statsWrapper left-align'>
          <p>{props.card.name}</p>
          <ul>
            <li>Home Runs: {props.card.type}</li>
            <li>Average: {props.card.power}</li>
            <li>Hits: {props.card.advantages['Space Cowboy']}</li>
            <li>RBI: {props.card.advantages['Space Samurai']}</li>
            <li>Stolen Bases: {props.card.advantages['Space Wizard']}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Card;
