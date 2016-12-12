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
      <div className="waiting z-depth-5 valign-wrapper">
        <div className='valign center-block'>
          <h2 className=''>OUTCOME</h2>
          
          <Card card={this.props.userCard} />
          <Card card={this.props.oppCard}/>
        </div>
      </div>
    );
  }
}

export default Outcome;
