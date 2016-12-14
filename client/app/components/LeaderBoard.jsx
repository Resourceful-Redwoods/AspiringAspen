import React, { PropTypes } from 'react';


class LeaderBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      leaders: props.users.sort((a, b) => (a.wins / a.loses) < (b.wins / b.loses))
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
    <div className='cover'>
      <div className='leaderboard z-depth-5'>
        <h2 className=''>LEADER BOARD</h2>
        <ul class="collection">
          {this.state.leaders.map((leader, key) => {
            return (
              <li key={key} class="collection-item avatar">
                <h1>{key + 1}. </h1>
                <span class="title">{leader.username}</span>
                <p class="secondary-content">Wins: {leader.wins}<br />
                   Loses: {leader.loses}
                </p>
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
