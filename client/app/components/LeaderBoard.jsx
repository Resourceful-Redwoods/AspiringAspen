import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

class LeaderBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      leaders: props.users.sort((a, b) => (a.wins / a.losses) < (b.wins / b.losses))
                          .slice(0, 10)
    };
  }

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    TweenMax.fromTo('.waiting', 0.7, {y: -100, opacity: 0}, {y: 0, opacity: 1, ease: Expo.easeOut});
  }

  componentWillUnmount() {
    const el = ReactDOM.findDOMNode(this);
    TweenMax.fromTo('.waiting', 0.7, {y: 0, opacity: 1}, {y: -100, opacity: 0, ease: Expo.easeOut});
  }

  render () {
    return (
    <div className='cover' onClick={this.props.onShowLeaderBoard}>
      <div className='leaderboard z-depth-5'>
        <h3 className='center-align'>LEADER BOARD</h3>
        <ul className="collection">
          {this.state.leaders.map((leader, key) => {
            return (
              <li key={key} className="collection-item avatar">
                <h5>{key + 1}. {leader.name}</h5>
                <p className="secondary-content">Wins: {leader.wins}<br />
                   Losses: {leader.losses}
                </p>
                {leader.status};
              </li>
            );
          })}
        </ul>
      </div>
    </div>
    );
  }
}

LeaderBoard.propTypes = {
  users: PropTypes.array.isRequired
};

export default LeaderBoard;
