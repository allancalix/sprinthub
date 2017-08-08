// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { forOwn, forEach, filter } from 'lodash';
import JiraLogin from './JiraLogin';
import SelectTask from './SelectTask';

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
    exclude: ['Description', 'Summary', 'Key', 'Issue Type', 'Affects Version/s', 'Fix Version/s', 'Linked Issues'],
    toAdd: {},
    optionsMap: {},
    matchingForm: '',
    form: {
      domain: this.props.jiraForm.domain,
      project: this.props.jiraForm.project,
      username: this.props.jiraForm.username,
      password: this.props.jiraForm.password,
      issuetype: ''
    },
    errors: {
      username: '',
      password: ''
    }
  }

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.jiraForm !== nextProps.jiraForm && (nextProps.jiraForm.tasks.length > 0)) {
      const nextState = Object.assign({},
        this.state.form,
        { form: {
          username: nextProps.jiraForm.username,
          password: nextProps.jiraForm.password,
          domain: nextProps.jiraForm.domain,
          project: nextProps.jiraForm.project
        } }
      );
      this.setState({ nextState });
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
    this.setState({ form, matchingForm: task[0].id }, () => this.props.getFields(this.state.form, task[0].id));
  }

  createJiraBoard = (event: {preventDefault: () => void}) => {
    event.preventDefault();
    if (this.state.form.issuetype === '') {
      return false;
    }
    let pointsEntry = false;
    forOwn(this.props.jiraForm.optionsMap[this.state.matchingForm], value => {
      if (value.name === 'Story Points') {
        const toAddState = this.state.toAdd;
        toAddState.customfield_10044 = 0;
        pointsEntry = toAddState;
      }
    });
    this.props.createJiraForm(this.props.boards, this.props.list, this.state.form, pointsEntry || this.state.toAdd);
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

  pushNewField = entry => {
    const toAdd = this.state.toAdd;
    let appendEntry = [];
    switch (entry.key) {
      case 'components':
        appendEntry = (toAdd.hasOwnProperty(entry.key))
          ? [...this.state.toAdd[entry.key], { name: entry.value }] : [{ name: entry.value }];
        toAdd[entry.key] = appendEntry;
        break;
      default:
        appendEntry = (toAdd.hasOwnProperty(entry.key))
          ? [...this.state.toAdd[entry.key], entry.value] : [entry.value];
        toAdd[entry.key] = appendEntry;
        break;
    }
    this.setState({ toAdd });
  }

  parseOptionalFields = () => {
    const fields = this.props.jiraForm.optionsMap[this.state.matchingForm];
    let optionalFields = forEach(fields, (value, key) =>
      Object.assign(value, { key })
    );
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
    console.log(optionalFields);
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
            <p> Issuetype: {this.state.form.issuetype}</p>
          </div>
        }
        {this.props.jiraForm.stateSet &&
          <div>
            <SelectTask
              onChange={this.selectIssueType}
              tasks={this.props.jiraForm.tasks}
              selected={this.state.form.issuetype}
              jiraSubmit={this.createJiraBoard}
              fetchOptions={this.parseOptionalFields}
              addField={this.pushNewField}
            />
          </div>
        }
      </div>
    );
  }
}

export default JiraForm;
