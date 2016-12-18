import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

class ChallengeModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      challenger: '',
      challengee: '',
      modalMessage: ''
    };
  }

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    TweenMax.fromTo('.waiting', 0.7, {y: -100, opacity: 0}, {y: 0, opacity: 1, ease: Expo.easeOut});

    this.setState({
      challenger: this.props.challenger,
      challengee: this.props.challengee,
      modalMessage: `Checking to see if ${this.props.challengee} has the guts to accept your request...`
    });

    // this.props.socket.on('challenge', function(response) {
    //   if (response.type === 'challengeAccepted') {
    //     // if challenge is accepted, notify the user in the modal and tell them to keep waiting.
    //   } else if (response.type === 'challengeDeclined') {
    //     // if challenge is declined, notify the user and hide the modal.
    //   }
    // });
  }

  componentWillUnmount() {
    const el = ReactDOM.findDOMNode(this);
    TweenMax.fromTo('.waiting', 0.7, {y: 0, opacity: 1}, {y: -100, opacity: 0, ease: Expo.easeOut});

    this.props.socket.removeListener('challenge');
  }

  _handleCancelClick(leader) {

    // this.props.socket.on('challenge', function(response) {
    //   console.log(response);
    //   if (response.type === 'challengeAccepted') {
    //     // if challenge is accepted, notify the user in the modal and tell them to keep waiting.
    //   } else if (response.type === 'challengeDeclined') {
    //     // if challenge is declined, notify the user and hide the modal.
    //   }
    // });

    // const data = {
    //   'type': 'challengeRequest',
    //   'challenger': this.props.username,
    //   'challengee': {
    //     'name': leader.name,
    //     'status': leader.status
    //   }
    // };

    // this.props.socket.emit('challenge', data);

    //TODO[challenge]: show modal saying, "challenging 'username', please wait..."
  }

  render () {
    return (
      <div className='cover'>
        <div className='challenge z-depth-5'>
          <h3 className='center-align'>Battle to the DEATH!</h3>
          <p>{this.state.modalMessage}</p>
          <div className='center-align'>
            <button className='btn' onClick={() => {
              this.props.onShowChallengeModal();
              this.props.onShowLeaderBoard();
            }}>
              Cancel
            </button>
            <br/>
            <br/>
          </div>
        </div>
      </div>
    );
  }
}

ChallengeModal.propTypes = {
  socket: PropTypes.object.isRequired,
  onShowLeaderBoard: PropTypes.func.isRequired,
  onShowChallengeModal: PropTypes.func.isRequired,
  // challenger: PropTypes.string.isRequired,
  // challengee: PropTypes.string.isRequired
};

export default ChallengeModal;
