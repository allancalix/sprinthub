// @flow
import React, { Component } from 'react';
import { Grid, Menu, Table, Button, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { forOwn, forEach, filter, has } from 'lodash';
import JiraLogin from './JiraLogin';
import SelectTask from './SelectTask';
import { getUsers } from '../lib/Jira';

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
    // Temporary exclusion to access the variety of schema
    exclude: ['Description', 'Summary', 'Key', 'Issue Type', 'Sprint', 'Affects Version/s', 'Fix Version/s', 'Linked Issues', 'Project', 'Priority', 'Attachment', 'Epic Link'],
    toAdd: {},
    addedEntryList: [],
    optionsMap: {},
    matchingForm: '',
    usernameSearch: [],
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
    },
    extras: {}
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

  getUsernames = (event: { preventDefault: () => void }, data) => {
    const userList = getUsers(this.state.form, this.props.jiraForm.optionsMap[this.state.matchingForm].assignee.autoCompleteUrl+data, list =>
      this.setState({ usernameSearch: list })
    );
  }

  createJiraBoard = (event: {preventDefault: () => void}) => {
    event.preventDefault();
    if (this.state.form.issuetype === '') {
      return false;
    }
    let pointsEntry = false;
    forOwn(this.props.jiraForm.optionsMap[this.state.matchingForm], (value, key) => {
      if (value.name === 'Story Points') {
        const toAddState = this.state.toAdd;
        toAddState.storyPoints = key;
        pointsEntry = toAddState;
      }
    });
    forOwn(this.state.extras, (value, key) => {
      this.state.extras[key].matchingFields = Object.keys(this.props.jiraForm.optionsMap[value.issuetypeId]);
    });
    this.props.createJiraForm(
      this.props.boards,
      this.props.list,
      this.state.form,
      pointsEntry || this.state.toAdd,
      this.state.extras
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
        this.setState({ addedEntryList: [
          ...this.state.addedEntryList,
          {
            key: entry.key,
            name: this.props.jiraForm.optionsMap[this.state.matchingForm][entry.key].name,
            value: entry.value
          }
        ] });
        break;
    }
    this.setState({ toAdd });
  }

  indexSubtask = newEntry => {
    if (!this.props.jiraForm.optionsMap[newEntry.issuetype.id]) {
      this.props.getFields(Object.assign({}, this.state.form, { issuetype: newEntry.issuetype.value }), newEntry.issuetype.id);      
    }
    const extras = this.state.extras;
    extras[newEntry.id] = {
      label: newEntry.title,
      issuetype: newEntry.issuetype.value,
      issuetypeId: newEntry.issuetype.id,
      assignee: newEntry.assignee.value
    };
    this.setState({ extras });
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
            <Menu.Item as={Link} to="/"><Icon name="arrow left" />SprintHub</Menu.Item>
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
              <Table basic celled collapsing padded size="large" style={{ fontSize: '2em' }}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Field</Table.HeaderCell>
                    <Table.HeaderCell>Value</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Connected</Table.Cell>
                    <Table.Cell>{this.props.jiraForm.domain}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>User</Table.Cell>
                    <Table.Cell>{this.props.jiraForm.username}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Project</Table.Cell>
                    <Table.Cell>{this.props.jiraForm.project}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell>Issuetype</Table.Cell>
                    <Table.Cell>{this.state.form.issuetype}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
              <Button fluid primary size="small" onClick={this.createJiraBoard}>Create Board</Button>
            </div>
          }
        </Grid.Row>
        <Grid.Row centered columns={1}>
          <Grid.Column>
            {(this.state.addedEntryList.length > 0) &&
            <Table
              basic
              celled
              style={{
                fontSize: '1.6em',
                marginBottom: '25px'
              }}
            >
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Field</Table.HeaderCell>
                  <Table.HeaderCell>Value</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.state.addedEntryList.map(entry => (
                  (typeof (entry.value[0]) === 'string') && <Table.Row key={`${entry.key}+${entry.value}`}>
                    <Table.Cell>{entry.name}</Table.Cell>
                    <Table.Cell>{String(entry.value)}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            }
          </Grid.Column>
          {this.props.jiraForm.stateSet &&
            <SelectTask
              onChange={this.selectIssueType}
              tasks={this.props.jiraForm.tasks}
              subtasks={this.props.jiraForm.subtasks}
              selected={this.state.form.issuetype}
              jiraSubmit={this.createJiraBoard}
              fetchOptions={this.parseOptionalFields}
              addField={this.pushNewField}
              pushSubtask={this.indexSubtask}
              trackedSubtasks={this.state.extras}
              getUsernames={this.getUsernames}
              availableUsernames={this.state.usernameSearch}
            />
          }
        </Grid.Row>
      </Grid>
    );
  }
}

export default JiraForm;
