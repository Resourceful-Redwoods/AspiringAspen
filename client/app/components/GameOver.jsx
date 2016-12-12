import React from 'react';
import ReactDOM from 'react-dom';

const GameOver = (props) => {
  // displays the winner/loser of the game
  if (props.winner === 'win') {
    return (
      <div className='cover'>
        <div className='youWin z-depth-5 valign-wrapper'>
          <div className='valign center-block'>
            <h2>YOU WIN</h2>
            <button onClick={props.exitGame}>Exit</button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className=''>
        <div className='youLose z-depth-5 valign-wrapper'>
          <div className='valign center-block'>
            <h2>YOU LOSE</h2>
            <button onClick={props.exitGame}>Exit</button>
          </div>
        </div>
      </div>
    );
  }
};

export default GameOver;
