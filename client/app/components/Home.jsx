import React from 'react';
import ReactDOM from 'react-dom';

import Waiting from './Waiting.jsx';
import Game from './Game.jsx';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchmaking: false
    };
  }

  componentDidMount () {
    // socket.on('init', this._initialize);
    // listen to see if there is a match
    // socket.on('is matched', this._isMatch);
  }

  componentWillUnmount() {}

  _initialize() {
    // do things right away
  }

  _isMatch() {
    // redirect to /game
  }

  playNow () {
    console.log('play now');
    this.setState({ matchmaking: true });

    // kick off matchmaking
    // socket.emit('game', 'play');
  }

  cancelMatchmaking () {
    this.setState({ matchmaking: false });
    console.log('cancel');
    // cancel matchmaking
    // socket.emit('game', 'play');
  };

  render() {
    let isMatchmaking = this.state.matchmaking;
    return (
      <div>
        <div className="titlebar">
          <h1>DeckStomp</h1>
        </div>
        { isMatchmaking ? <Waiting cancelMatchmaking={this.cancelMatchmaking.bind(this)} /> : null }
        <div>
          <form id='nameForm'>
            <label>
              Enter a name:
              <input type="text" name="name" />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <button onClick={ this.playNow.bind(this) }> Play Now! </button>
        </div>
      </div>
    );
  }
}

export default Home;
