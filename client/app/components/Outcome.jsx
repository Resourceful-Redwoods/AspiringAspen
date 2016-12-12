import React from 'react';
import ReactDOM from 'react-dom';

import Card from './Card.jsx';

class Outcome extends React.Component {

  // display the the outcome of the round

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    TweenMax.fromTo('.outcome', 0.7, {y: -100, opacity: 0}, {y: 0, opacity: 1, ease: Expo.easeOut});
  }
  componentWillUnmount() {
    TweenMax.fromTo('.outcome', 0.7, {y: 0, opacity: 1}, {y: -100, opacity: 0, ease: Expo.easeOut});
  }

  render() {
    return (
      <div className='cover'>
        <div className="outcome row z-depth-5 valign-wrapper">
          <div className='col s3'>
            <h2>{this.props.outcome}</h2>
          </div>
            <div className='col s9 outcomeCardwrapper'>
              <Card card={this.props.userCard} />
              <Card card={this.props.oppCard} />
            </div>
        </div>
      </div>
    );
  }
}

export default Outcome;
