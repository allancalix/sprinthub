// @flow
import React, { Component } from 'react';
import { Grid, Menu, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { forOwn, forEach, filter, has } from 'lodash';
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
    issuetype: string,
    optionsMap: Object
  }
};

class JiraForm extends Component<void, Props, State> {
  state = {
    exclude: ['Description', 'Summary', 'Key', 'Issue Type', 'Affects Version/s', 'Fix Version/s', 'Linked Issues', 'Project', 'Priority', 'Attachment'],
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
        {
          form: {
            username: nextProps.jiraForm.username,
            password: nextProps.jiraForm.password,
            domain: nextProps.jiraForm.domain,
            project: nextProps.jiraForm.project
          }
        }
      );
      this.setState({ nextState });
    }
  }

  updateField = (event: { target: { name: string, value: string } }) => {
    const field = event.target.name;
    const form = this.state.form;
    form[field] = field !== 'project'
      ? event.target.value : event.target.value.toUpperCase();
    return this.setState({ form });
  }

  selectIssueType = (event: { preventDefault: () => void }, data: Object) => {
    event.preventDefault();
    const task = filter(this.props.jiraForm.tasks, { name: data.value });
    const field = data.name;
    const form = this.state.form;
    form[field] = data.value;
    if (has(this.props.jiraForm.optionsMap, task[0].id)) {
      return this.setState({
        form,
        matchingForm: task[0].id
      });
    }
    return this.setState({ form, matchingForm: task[0].id }, () =>
      this.props.getFields(this.state.form, task[0].id));
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
    this.props.createJiraForm(
      this.props.boards,
      this.props.list,
      this.state.form,
      pointsEntry || this.state.toAdd
    );
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
        toAdd[entry.key] = entry.value;
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
    return optionalFields;
  }

  render() {
    return (
      <Grid padded>
        <Grid.Row columns={1}>
          <Menu fixed="top" size="large" fluid>
            <Menu.Item as={Link} to="/">Sprint Hub</Menu.Item>
            <Menu.Menu position="right" />
          </Menu>
        </Grid.Row>
        <Grid.Row />
        <Grid.Row centered>
          {!this.props.jiraForm.stateSet ?
            <JiraLogin
              form={this.state.form}
              onChange={this.updateField}
              onSubmit={this.getFieldOptions}
              errors={this.props.jiraForm.jiraLoginErrors}
              pendingLogin={this.props.jiraForm.showLoginLoader}
            />
            : <div>
              <h3>Connected: {this.props.jiraForm.domain}</h3>
              <Button primary size="small" onClick={this.createJiraBoard}>Create Board</Button>
              <h4> User: {this.props.jiraForm.username}</h4>
              <h4> Project: {this.props.jiraForm.project}</h4>
              <h4> Issuetype: {this.state.form.issuetype}</h4>
            </div>
          }
        </Grid.Row>
        <Grid.Row>
          {this.props.jiraForm.stateSet &&
            <SelectTask
              onChange={this.selectIssueType}
              tasks={this.props.jiraForm.tasks}
              selected={this.state.form.issuetype}
              jiraSubmit={this.createJiraBoard}
              fetchOptions={this.parseOptionalFields}
              addField={this.pushNewField}
            />
          }
        </Grid.Row>
      </Grid>
    );
  }
}

export default JiraForm;
