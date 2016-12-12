import React from 'react';
import ReactDOM from 'react-dom';


const GameOver = (props) => {
  console.log('GameOver', props);
  if (props.winner === 'win') {
    return (
      <div className='youWin z-depth-5 valign-wrapper'>
        <div className='valign center-block'>
          <h2>YOU WIN</h2>
          <button onClick={props.exit}>Exit</button>
        </div>
      </div>
    );
  } else {
    return (
      <div className='youLose z-depth-5 valign-wrapper'>
        <div className='valign center-block'>
          <h2>YOU LOSE</h2>
          <button onClick={props.exit}>Exit</button>
        </div>
      </div>
    );
  }
};

export default GameOver;
