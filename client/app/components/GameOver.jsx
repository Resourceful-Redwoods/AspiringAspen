import React from 'react';
import ReactDOM from 'react-dom';


const GameOver = (props) => {
  if (props.outcome === 'win') {
    return (
      <div>
        <h1>YOU WIN</h1>
        <button>Exit</button>
      </div>
    );
  } else {
    return (
      <div>
        <h1>YOU LOSE</h1>
        <button>Exit</button>
      </div>
    );
  }
};

export default GameOver;
