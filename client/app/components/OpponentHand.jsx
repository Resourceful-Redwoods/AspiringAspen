import React from 'react';
import ReactDOM from 'react-dom';

import Cardback from './Cardback.jsx';

const OpponentHand = (props) => {

  // this goes through the array of cards given to it and maps over it, given it a unique id
  // const usersCards = Object.keys(props.currentHand).map((key) =>
  //   <Cardback key={key} />
  // );
  var usersCards = [];
  for (var i = 0; i < props.currentHandLength; i++) {
    usersCards.push(<Cardback key={i} />);
  }

  return (
    <div className='row'>
      <div className='col s6 offset-s3 opponentHand'>
      {usersCards}
      </div>
    </div>
  );
};

export default OpponentHand;
