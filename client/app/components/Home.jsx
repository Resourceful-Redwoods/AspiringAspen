import React from 'react'
import ReactDOM from 'react-dom'

import Waiting from '.components/Waiting.jsx'
import Game from '.components/Game.jsx'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount () {

  }

  playNow () {
    //kick off matchmaking

    //render waiting component?
  }

  render() {
    return (
      <div>
        <div class="titlebar">
          <h1>DeckStomp</h1>
        </div>
        <div>
          <form>
            <label>
              Enter a name:
              <input type="text" name="name" />
            </label>
            <input type="submit" value="Submit" />
          </form>
          <button onClick={this.playNow}> Play Now! </button>
        </div>
      </div>
    )
  }
}


