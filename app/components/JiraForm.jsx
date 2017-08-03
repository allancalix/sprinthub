// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ipcRenderer } from 'electron';

ipcRenderer.on('return-token', (event, token) => {
  globalVar.callback(token);
});

type Props = {
  setTrelloToken: () => void,
  loadStatus: () => void,
  login: boolean
};

class JiraForm extends Component<void, Props, void> {
  render() {
    return (
      <div>
        <h1>JIRA FORM</h1>
        <Link to="/">Back Home</Link>
      </div>
    );
  }
}

export default JiraForm;
