import React from 'react';
import ReactDOM from 'react-dom';
// import TweenMax from 'gasp';

class GameOver extends React.Component {
  constructor(props) {
    super(props);
  }
  // displays the winner/loser of the game
  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    TweenMax.fromTo('.gameOver', 0.7, {y: -100, opacity: 0}, {y: 0, opacity: 1, ease: Expo.easeOut});
  }

  render() {
    return (
      <div className='cover'>
        <div className='gameOver youWin z-depth-5 valign-wrapper'>
          <div className='valign center-block'>
            <h2>{this.props.winner === 'win' ? 'YOU WIN' : 'YOU LOSE'}</h2>
            <button onClick={this.props.exitGame}>Exit</button>
          </div>
        </div>
      </div>
    );
  }
}

export default GameOver;
