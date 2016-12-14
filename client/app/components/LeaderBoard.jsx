import React, { PropTypes } from 'react';


class LeaderBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
      <div className="waiting z-depth-5 valign-wrapper">
        <div className='valign center-block'>
          <p>Welcome {this.props.username}!</p>
          <h2 className=''>SEARCHING</h2>
          <button onClick={ this.props.cancelMatchmaking.bind(this) } className="playbtn"> Cancel </button>
        </div>
      </div>
    </div>
    );
  }
}

export default LeaderBoard;
