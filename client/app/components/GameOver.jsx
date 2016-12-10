import React from 'react';
import ReactDOM from 'react-dom';


const GameOver = (props) => {
  return (
    <div>
      <h1>WINNER</h1>
      <h2>{props.winner} wins!</h2>
      <button>Exit</button>
    </div>
  );
};

export default GameOver;
