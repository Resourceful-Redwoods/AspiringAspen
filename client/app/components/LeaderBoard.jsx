import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import OnlineBadge from './OnlineBadge.jsx';

class LeaderBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      leaders: []
    };
  }

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    TweenMax.fromTo('.waiting', 0.7, {y: -100, opacity: 0}, {y: 0, opacity: 1, ease: Expo.easeOut});
    this.props.socket.emit('send me userdata', this._receiveUserData.bind(this));
    this.props.socket.on('userdata updated', ()=> {
      this.props.socket.emit('send me userdata', this._receiveUserData.bind(this));
    });
  }

  componentWillUnmount() {
    const el = ReactDOM.findDOMNode(this);
    TweenMax.fromTo('.waiting', 0.7, {y: 0, opacity: 1}, {y: -100, opacity: 0, ease: Expo.easeOut});

    this.props.socket.removeListener('userdata updated', ()=> {
      this.props.socket.emit('send me userdata', this._receiveUserData.bind(this));
    });
  }

  _receiveUserData(users) {
    this.setState({leaders: users.sort((a, b) => (a.wins / a.losses) < (b.wins / b.losses))
                          .slice(0, 10)});
  }

  _handleChallengeClick(leader) {
    this.props.socket.on('challenge', function(response) {
      if (response.type === 'challengeAccepted') {
        // if challenge is accepted, notify the user in the modal and tell them to keep waiting.
      } else if (response.type === 'challengeDeclined') {
        // if challenge is declined, notify the user and hide the modal.
      }
    });

    const data = {
      'type': 'challengeRequest',
      'challenger': this.props.username,
      'challengee': {
        'name': leader.name,
        'status': leader.status
      }
    };
    this.props.socket.emit('challenge', data);
    this.props.onShowLeaderBoard();
    this.props.onShowChallengeModal();
  }

  render () {
    return (
      <div className='cover'>
        <div className='leaderboard z-depth-5'>
          <h3 className='center-align'>LEADER BOARD</h3>
          <div className='leaderHolder'>
            <ul className="collection">
              {this.state.leaders.map((leader, key) => {
                return (
                  <li key={key} className="collection-item"
                  style={{'backgroundColor': '#e1e2e3'}}>
                    <div style={{'display': 'flex', 'alignItems': 'center'}}>
                      <div style={{'flexGrow': '7'}}>
                        <h5 style={{'flexGrow': '5'}}>{key + 1}. {leader.name}</h5>
                        <p style={{'flexGrow': '1', 'marginLeft': '4px' }}>Wins: {leader.wins} &nbsp; Losses: {leader.losses}</p>
                      </div>
                      <OnlineBadge status={leader.status}/>
                      <button style={{
                        'flexGrow': '0',
                        'background': '#742CA9',
                        'color': 'rgb(255, 197, 36)',
                        'textShadow': '1px 0px #ff4000',
                        'borderRadius': '25%'
                      }} className='btn' className={`btn ${this.props.username === '' ? 'disabled' : null}`} onClick={() => { this._handleChallengeClick(leader); }}>Challenge</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className='center-align'>
            <div className='leaderboardFooter'>
              <button className='btn' onClick={this.props.onShowLeaderBoard}>
                Close
              </button>
              <br/>
              <br/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LeaderBoard.propTypes = {
  onShowLeaderBoard: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  socket: PropTypes.object.isRequired
};

export default LeaderBoard;
