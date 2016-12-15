import React from 'react';
import ReactDOM from 'react-dom';
import LeaderBoard from './LeaderBoard.jsx';
import Waiting from './Waiting.jsx';
import Game from './Game.jsx';

class Home extends React.Component {
  constructor(props) {
    super(props);
    // state for the home page
    // mainly storing username and if the current player is waiting for an opponent or not
    this.state = {
      gameState: 'idle',
      username: '',
      hasUsername: false,
      showForm: true,
      showLeaderBoard: false
    };
  }

  componentDidMount () {
    // listen to see if there is a match
    this.props.socket.on('enter game', this._enterGame.bind(this));
    this.props.socket.on('send users', this._receiveUserData.bind(this));
    TweenMax.fromTo('.titlebar', 1.25, {y: -900, opacity: 0.8}, {y: 0, opacity: 1, ease: Expo.easeOut, delay: 0.35});
    TweenMax.fromTo('.lower', 1.25, {y: 900, opacity: 0.8}, {y: 0, opacity: 1, ease: Expo.easeOut, delay: 0.35});
    TweenMax.fromTo('.titlebar img', 0.5, {opacity: 0}, {opacity: 1, ease: Expo.easeOut, delay: 1.75});
    TweenMax.fromTo('.nameForm', 1.25, {opacity: 0}, {opacity: 1, ease: Expo.easeOut, delay: 3});
  }

  componentWillUnmount() {}

  _receiveUserData(users) {
    this.state.users = users;
  }

  _enterGame() {
    // if there is a game, send the user to /game ot match up against opponent
    this.props.socket.emit('set username', this.state.username);
    this.props.router.push('/game');
  }

  playNow () {
    // indicates that the user is waiting on the client side and tells server that they are ready to play
    this.setState({ gameState: 'waiting' });
    this.props.socket.emit('game', 'play');
    // gamestate is waiting
  }

  handleShowLeaderBoard () {
    if (this.state.showLeaderBoard) {
      this.setState({
        showLeaderBoard: false
      });
    } else {
      this.setState({
        showLeaderBoard: true
      });
    }
  }

  cancelMatchmaking () {
    // cancels match making and tells server
    this.setState({ gameState: 'idle' });
    // gameState is idle, emit it back to server
    this.props.socket.emit('game', 'cancel');
  }

  handleUsernameChange(e) {
    // when a user types in the form, set that value to be the username state and that the username has a username
    this.setState({username: e.target.value});
    this.setState({ hasUsername: true });
  }

  handleSubmit(e) {
    e.preventDefault();
    // submit is not allowed if there is no username
    if ( this.state.username !== '' ) {
      this.setState({ hasUsername: true, showForm: false });
      // emits the username to the server
      this.props.socket.emit('set username', this.state.username);
      // fires playNow
      this.playNow();
    }
  }

  render() {
    let gameState = this.state.gameState;
    return (
      <div id='home' className='wrapper'>
        <div className='row'>
          <div className="titlebar col s12">
            <h1>DECK</h1>
            <img className='cardIcon' src='img/cardIcon.svg'></img>
          </div>
        </div>
        { this.state.showLeaderBoard === true ? <LeaderBoard onShowLeaderBoard={this.handleShowLeaderBoard.bind(this)} users={this.state.users} /> : null }
        { gameState === 'waiting' ? <Waiting cancelMatchmaking={this.cancelMatchmaking.bind(this)} username={this.state.username} /> : null }
        <div className='row lower'>
          <div id='' className='col s12'>
          <h1>STOMP</h1>
            <div className='center-block'>
              { this.state.showForm ? (
              <form className='nameForm' onSubmit={this.handleSubmit.bind(this)}>
                <label>
                  <input type="text" placeholder='enter a name' name="name" onChange={this.handleUsernameChange.bind(this)}/>
                </label>
              </form>
            ) : null }
            </div>
            <button className='leaderboard-button' onClick={this.handleShowLeaderBoard.bind(this)}>LEADERBOARD</button>
            { this.state.hasUsername ? <button className='play-button' onClick={ this.playNow.bind(this) }>PLAY <img src='img/playBtn.svg'></img> </button> : null }
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
