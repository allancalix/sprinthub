// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { forOwn, filter } from 'lodash';
import JiraLogin from './JiraLogin';
import SelectTask from './SelectTask';
import Jira from '../lib/Jira';

type Props = {
  getOptions: () => void,
  getFields: () => void,
  createJiraForm: () => void,
  jiraForm: {
    username: string,
    password: string,
    stateSet: boolean,
    domain: string,
    project: string,
    tasks: Array<{ id: string, name: string, iconUrl: string }>
  }
};

type State = {
  form: {
    domain: string,
    project: string,
    optionsMap: Object
  }
};

class JiraForm extends Component<void, Props, State> {
  state = {
    exclude: ['Description', 'Summary', 'Key', 'Issue Type'],
    optionsMap: {},
    matchingForm: '',
    form: {
      domain: this.props.jiraForm.domain,
      project: this.props.jiraForm.project,
      username: this.props.jiraForm.username,
      password: this.props.jiraForm.password,
      issuetype: this.props.jiraForm.tasks.length > 0 ? this.props.jiraForm.tasks[0].name : ''
    },
    errors: {
      username: '',
      password: ''
    }
  }

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.jiraForm !== nextProps.jiraForm && (nextProps.jiraForm.tasks.length > 0)) {
      this.setState({ form: {
        issuetype: nextProps.jiraForm.tasks[0].name,
        username: nextProps.jiraForm.username,
        password: nextProps.jiraForm.password,
        domain: nextProps.jiraForm.domain,
        project: nextProps.jiraForm.project
      } });
    }
  }

  updateField = (event: { target: { name: string, value: string } }) => {
    const field = event.target.name;
    const form = this.state.form;
    form[field] = event.target.value;
    return this.setState({ form });
  }

  selectIssueType = (event: { target: { name: string, value: string } }) => {
    const task = filter(this.props.jiraForm.tasks, { name: event.target.value });
    const field = event.target.name;
    const form = this.state.form;
    form[field] = event.target.value;
    if (this.props.jiraForm.optionsMap.hasOwnProperty(task[0].id)) {
      return this.setState({
        form,
        matchingForm: task[0].id
      });
    }
    this.setState({ form }, () => this.props.getFields(this.state.form));
  }

  createJiraBoard = (event: {preventDefault: () => void}) => {
    event.preventDefault();
    this.props.createJiraForm(this.props.boards, this.props.list, this.state.form);
  }

  getFieldOptions = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if (this.props.jiraForm.stateSet) {
      this.setState({
        form: {
          username: this.props.jiraForm.username,
          password: this.props.jiraForm.password,
        }
      });
    }
    this.props.getOptions(this.state.form);
  }

  parseOptionalFields = () => {
    const fields = this.props.jiraForm.optionsMap[this.state.matchingForm];
    let optionalFields = [];
    forOwn(fields, (value) => {
      if (!value.required) {
        optionalFields = [...optionalFields, value];
      }
    });
    optionalFields = filter(optionalFields, field => {
      let isExcluded = false;
      for (let i = 0, j = this.state.exclude.length; i < j; i += 1) {
        if (this.state.exclude[i] === field.name) {
          isExcluded = true;
        }
      }
      if (!isExcluded) {
        return field;
      }
    });
    return optionalFields;
  }

  render() {
    return (
      <div>
        <h1 onClick={this.test}>JIRA FORM</h1>
        <Link to="/">Back Home</Link>
        {!this.props.jiraForm.stateSet ?
          <JiraLogin
            form={this.state.form}
            onChange={this.updateField}
            onSubmit={this.getFieldOptions}
            errors={this.state.errors}
          />
          : <div>
            <h3>Domain: {this.props.jiraForm.domain}</h3>
            <p> User: {this.props.jiraForm.username}</p>
            <p> Project: {this.props.jiraForm.project}</p>
          </div>
        }
        {this.props.jiraForm.stateSet &&
          <div>
            <SelectTask
              onChange={this.selectIssueType}
              tasks={this.props.jiraForm.tasks}
              jiraSubmit={this.createJiraBoard}
              fetchOptions={this.parseOptionalFields}
            />
          </div>
        }
      </div>
    );
  }
}

export default JiraForm;
