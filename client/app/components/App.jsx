import React from 'react';
import ReactDOM from 'react-dom';

let socket = io();

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children,
     (child) => React.cloneElement(child, {
       socket: socket
     })
    );

    return (
      <div>
        {childrenWithProps}
      </div>
    );
  }
}

export default App;