// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TextInput from './common/TextInput';
import Trello from '../lib/Trello';
import { ipcRenderer } from 'electron';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      credentials: {
        Username: '',
        Password: ''
      }
    }

    this.login = this.login.bind(this);
  }

  login(event) {
    event.preventDefault();
    Trello.login(body => {
      this.setState({swag: () => {__html: body}});
    });
    ipcRenderer.send('trello-login', Trello.login());
  }

  render() {
    return (
      <div>
        <h1>Login Page</h1>
        <Link to="/">To Home</Link>
        <br></br>
        <button onClick={this.login}>Login to Trello</button>
      </div>
    );
  }
}

export default Login;
          // {this.state.swag !== undefined ? 
          //   <webview dangerouslySetInnerHTML={this.state.swag()} /> : null
          // }