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
      <div id="waiting">
        <h1>Finding a match</h1>
        <button onClick={ this.props.cancelMatchmaking.bind(this) }> Cancel </button>
      </div>
    );
  }
}

export default Waiting;