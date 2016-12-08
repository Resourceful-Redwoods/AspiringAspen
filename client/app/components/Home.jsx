import React from 'react'
import ReactDOM from 'react-dom'

import Waiting from './Waiting.jsx'
import Game from './Game.jsx'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchmaking: false
    }
  }

  componentDidMount () {

  }

  playNow () {
    console.log('play now');
    this.setState({ matchmaking: true });
    //kick off matchmaking
    socket.emit('game', 'play');
  }

  cancelMatchmaking () {

  }

  componentWillUnmount() {
    this.setState({ matchmaking: false });
  }

  render() {
    const isMatchmaking = this.state.matchmaking;
    return (
      <div>
        <div className="titlebar">
          <h1>DeckStomp</h1>
        </div>
        { isMatchmaking ? <Waiting /> : null }
        <div>
          <form id='nameForm'>
            <label>
              Enter a name:
              <input type="text" name="name" />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <button onClick={ this.playNow }> Play Now! </button>
        </div>
      </div>
    )
  }
}

export default Home;