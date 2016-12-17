 import React, { PropTypes } from 'react';
 import ReactDOM from 'react-dom';

 class SignIn extends React.Component {
 	constructor(props) {
 		super(props);

 		this.state = {
 			username: '',
 			password: '',
 		}
 	}
	componentDidMount() {
		this.props.socket.on('checkedAuth', function(bool){this.handleCheckedAuth(bool)}.bind(this));

    const el = ReactDOM.findDOMNode(this);
    TweenMax.fromTo('.waiting', 0.7, {y: -100, opacity: 0}, {y: 0, opacity: 1, ease: Expo.easeOut});
  }

  componentWillUnmount() {
    const el = ReactDOM.findDOMNode(this);
    TweenMax.fromTo('.waiting', 0.7, {y: 0, opacity: 1}, {y: -100, opacity: 0, ease: Expo.easeOut});
  }

  handleSubmit (e) {
  	e.preventDefault()
  	var username = this.state.username;
  	var password = this.state.password;
  	// submit is not allowed if there is no username
  	if(username === '' || password === '') {
  		alert('Please enter a username/password');
  		return;
  	}
  	//check username against database
  	this.props.socket.emit('checkAuth', {username:username, password:password})
  }

  handleCheckedAuth (bool) {
		var checkedAuth = bool;
  	//check password against database
  	if(checkedAuth) {
      //unrenders form and changes username state in Home.jsx
  		this.props.handleFormSubmit(this.state.username, this.state.password);
  		// emits the username to the server
	    this.props.socket.emit('set username', this.state.username)
  	} else {
  		alert('Username and password are not correct.');
  	}
  }

	handleUsernameChange (e) {
	  this.setState({username: e.target.value});
	}

	handlePasswordChange(e) {
    this.setState({password: e.target.value});
	}

  render () {
  	return (
  		<div className='cover signinup z-depth-5'>
  			<h3 className='center-align'> Sign In </h3>
				<form onSubmit={this.handleSubmit.bind(this)}>
  				Username
  				<input name='username' type='text' onChange={this.handleUsernameChange.bind(this)} />
  				Password
  				<input name='password' type='text' onChange={this.handlePasswordChange.bind(this)} />
  				<input type='submit' value='Sign In' />
  			</form>
  		</div>
  	)
  }
 }





 SignIn.propTypes = {

 }

 export default SignIn;