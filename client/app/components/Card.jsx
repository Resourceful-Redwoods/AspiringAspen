import React from 'react';
import ReactDOM from 'react-dom';

const Card = (props) => {
  return (
    <div className={props.currentSelectedCard === props.card ? 'selected-card cardFront hoverable center-block' : 'cardFront hoverable center-block'} onClick={() => props.selectCard(props.card)}>
      <div className='cardFrontWrapper'>
        <img className='circle' src={props.card.image}></img>
        <div className='statsWrapper left-align'>
          <p>{props.card.name}</p>
          <ul>
            <li>Class: {props.card.type}</li>
            <li>Power: {props.card.power}</li>
            <p>Power Boosts</p>
            <li>Vs Cowboy: {props.card.advantages['Space Cowboy']}</li>
            <li>Vs Samurai: {props.card.advantages['Space Samurai']}</li>
            <li>Vs Wizard: {props.card.advantages['Space Wizard']}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Card;
