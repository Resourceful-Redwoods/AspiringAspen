import React from 'react';
import ReactDOM from 'react-dom';

import Card from './Card.jsx';

const UserHand = (props) => {

  // maps over the user cards, giving them all props from game
  const usersCards = Object.keys(props.currentHand).map((card, key) =>
    <Card card={props.currentHand[card]} selectCard={props.selectCard} currentSelectedCard={props.currentSelectedCard} key={key} />
  );

  return (
    <div className='row'>
      <div className='userHand col s8 offset-s2'>
        {usersCards}
      </div>
      <button className='playbtn' onClick={props.playCard} disabled={props.isWaiting}>Play Card</button>
    </div>
  );
};

export default UserHand;
