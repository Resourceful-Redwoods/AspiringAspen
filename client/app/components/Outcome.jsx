import React from 'react';
import ReactDOM from 'react-dom';

import Card from './Card.jsx';

class Outcome extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount () {
    //enter display
  }

  componentWillUnmount () {
    //leave display
  }

  render() {
    return (
      <div className="outcome row z-depth-5 valign-wrapper">
        <div className='col s3'>
          <h2>{this.props.outcome}</h2>
        </div>
          <div className='col s9 outcomeCardwrapper'>
            <Card card={this.props.userCard} />
            <Card card={this.props.oppCard} />
          </div>
      </div>
    );
  }
}

export default Outcome;
