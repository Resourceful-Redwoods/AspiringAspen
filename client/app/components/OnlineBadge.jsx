import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

class OnlineBadge extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: {
        'offline': 'red',
        'in game': 'orange',
        'online': 'green'
      }
    };
  }

  render() {
    return <span style={{
      'flexGrow': '1',
      'borderTopLeftRadius': '45%',
      'borderBottomLeftRadius': '45%',
      'borderTopRightRadius': '25%',
      'borderBottomRightRadius': '25%',
      'marginRight': '-1px',
      'marginLeft': '10px'
    }}
    className={'new badge ' + this.state.color[this.props.status]}
    data-badge-caption={this.props.status}></span>;
  }

}

export default OnlineBadge;