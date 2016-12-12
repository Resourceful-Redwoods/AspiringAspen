import React from 'react';
import ReactDOM from 'react-dom';

class Waiting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      foundMatch: false
    };
  }

  componentDidMount () {
    //enter display
  }

  componentWillUnmount () {
    //leave display
  }

  render() {
    return (
      <div className='cover'>
        <div className="waiting z-depth-5 valign-wrapper">
          <div className='valign center-block'>
            <h2 className=''>WAITING</h2>
            <button onClick={ this.props.cancelMatchmaking.bind(this) }> Cancel </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Waiting;
