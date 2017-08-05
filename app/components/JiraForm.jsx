// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import TextInput from './common/TextInput';
import { fetchIssueFields } from '../lib/Jira';

ipcRenderer.on('return-token', (event, token) => {
  globalVar.callback(token);
});

// type Props = {
//   setTrelloToken: () => void,
//   loadStatus: () => void,
//   login: boolean
// };

class JiraForm extends Component<void, Props, void> {
  constructor(props) {
    super(props);

    this.updateField = this.updateField.bind(this);
    this.getFieldOptions = this.getFieldOptions.bind(this);
  }

  state = {
    form: {
      domain: ''
    },
  }

  updateField(event: { target: { name: string, value: string } }) {
    const field = event.target.name;
    const form = this.state.form;
    form[field] = event.target.value;
    return this.setState({ form: form });
  }

  getFieldOptions(event) {
    event.preventDefault();
    fetchIssueFields(this.state.form.domain);
  }

  render() {
    return (
      <div>
        <h1>JIRA FORM</h1>
        <Link to="/">Back Home</Link>
        <TextInput
          label={"Domain: "}
          name={"domain"}
          placeholder={"domain.jira.com"}
          value={this.state.form.domain}
          onChange={this.updateField}
          error={""}
        />
        <button onClick={this.getFieldOptions}>Get Fields</button>
      </div>
    );
  }
}

export default JiraForm;
