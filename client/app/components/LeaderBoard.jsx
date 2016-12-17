import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

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
    console.log(this.props);
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

  render () {
    return (
      <div className='cover'>
        <div className='leaderboard z-depth-5'>
          <h3 className='center-align'>LEADER BOARD</h3>
          <ul className="collection">
            {this.state.leaders.map((leader, key) => {
              return (
                <li key={key} className="collection-item">
                  <div style={{'display': 'flex', 'alignItems': 'center'}}>
                    <h5 style={{'flexGrow': '5'}}>{key + 1}. {leader.name}</h5>
                    <p style={{'flexGrow': '1'}}>Wins: {leader.wins} <br/> Losses: {leader.losses}</p>
                    {leader.status};
                    <button style={{'flexGrow': '1'}} className='btn'>Challenge</button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className='center-align'>
            <button className='btn' onClick={this.props.onShowLeaderBoard}>
              Close
            </button>
            <br/>
            <br/>
          </div>
        </div>
      </div>
    );
  }
}

LeaderBoard.propTypes = {
  onShowLeaderBoard: PropTypes.func.isRequired
};

export default LeaderBoard;
