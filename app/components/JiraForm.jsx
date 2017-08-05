// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { forOwn, filter } from 'lodash';
import JiraLogin from './JiraLogin';
import SelectTask from './SelectTask';
import TaskForm from './TaskForm';

type Props = {
  getOptions: () => void,
  jiraForm: {
    username: string,
    password: string,
    stateSet: boolean,
    domain: string,
    tasks: Array<{ id: string, name: string, iconUrl: string }>
  }
};

type State = {
  form: {
    domain: string,
    project: string,

  }
};

class JiraForm extends Component<void, Props, State> {
  state = {
    exclude: ['Description', 'Summary', 'Key', 'Issue Type'],
    form: {
      domain: this.props.jiraForm.domain,
      project: this.props.jiraForm.project,
      username: this.props.jiraForm.username,
      password: this.props.jiraForm.password,
      issuetype: this.props.jiraForm.tasks.length > 0 ? this.props.jiraForm.tasks[0].id : ''
    },
    errors: {
      username: '',
      password: ''
    }
  }

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.jiraForm !== nextProps.jiraForm && (nextProps.jiraForm.tasks.length > 0)) {
      this.setState({ form: {
        issuetype: nextProps.jiraForm.tasks[0].id,
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
    const fields = this.props.jiraForm.fieldsMap[this.state.form.issuetype];
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
        <h1>JIRA FORM</h1>
        <Link to="/">Back Home</Link>
        {!this.props.jiraForm.stateSet ?
          <JiraLogin
            form={this.state.form}
            onChange={this.updateField}
            onSubmit={this.getFieldOptions}
            errors={this.state.errors}
          />
          : <div><h3>{this.props.jiraForm.domain}</h3></div>
        }
        {this.props.jiraForm.stateSet &&
          <div>
            <SelectTask
              onChange={this.updateField}
              tasks={this.props.jiraForm.tasks}
            />
            <TaskForm optionalFields={this.parseOptionalFields()} />
          </div>
        }
        <button onClick={this.createJiraBoard}>CREATE</button>
      </div>
    );
  }
}

export default JiraForm;
// Areas populated by boards: description + summary + story points