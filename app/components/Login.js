// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import { authenticateTrello } from '../lib/Sprint';

const globalVar = () => {};

ipcRenderer.on('return-token', (event, token) => {
  globalVar.callback(token);
});

type Props = {
  login: boolean
}

class Login extends Component<void, Props, void> {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.loadStatus();
  }

  componentWillMount() {
    globalVar.callback = data => {
      this.props.setTrelloToken(data);
    }
  }

  login(event) {
    event.preventDefault();
    ipcRenderer.send('trello-login', authenticateTrello());
  }

  render() {
    return (
      <div>
        <h1>Login Page</h1>
        <Link to="/">To Home</Link>
        <br></br>
        {this.props.login ?  
          <p>YOU ARE LOGGED IN</p> : <button onClick={this.login}>Login to Trello</button>
        }
      </div>
    );
  }
}

export default Login;