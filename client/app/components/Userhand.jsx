import React from 'react';
import ReactDOM from 'react-dom';

import Card from './Card.jsx';

const UserHand = (props) => {

  console.log('userhand', props);

  const usersCards = Object.keys(props.currentHand).map((card, key) =>
    <Card card={props.currentHand[card]} selectCard={props.selectCard} key={key} />
  );

  console.log('user usersCards', usersCards);

  return (
    <div>
      <p>Hello</p>
      <div>
        {usersCards}
      </div>
      <button onClick={props.playCard}>Play Card</button>
    </div>
  );
};

// UserHand.propTypes = {
//   currentHand: PropTypes.array.isRequired,
//   username: PropTypes.string.isRequired,
//   playCard: PropTypes.func.isRequired
// }

export default UserHand;