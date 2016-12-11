import React from 'react';
import ReactDOM from 'react-dom';

import Cardback from './Cardback.jsx';

const OpponentHand = (props) => {
  console.log('opp hand', props.currentHand);
  const usersCards = Object.keys(props.currentHand).map((key) =>
    <Cardback key={key} />
  );

  

  return (
    <div>
      OpponentHand
      {usersCards}
    </div>
  );
};

// OpponentHand.propTypes = {
//   currentHand: React.PropTypes.array.isRequired,
// };

export default OpponentHand;
