// @flow
import React, { Component } from 'react';
import { Grid, Dropdown } from 'semantic-ui-react';
import TaskForm from './TaskForm';

type taskType = {
  id: string,
  name: string,
  iconUrl: string
};

type Props = {
  tasks: Array<taskType>,
  onChange: () => void,
  jiraSubmit: () => void,
  fetchOptions: () => void,
};

class SelectTask extends Component<void, Props, void> {
  state = {
    itemsToAdd: {}
  }

  trackTaskForm = (event: { target: { name: string, value: string } }) => {
    const field = event.target.name;
    const itemsToAdd = this.state.itemsToAdd;
    itemsToAdd[field] = event.target.value;
    return this.setState({ itemsToAdd });
  }

  addEntry = (event: { target: { name: string, value: string } }) => {
    event.preventDefault();
    const key = event.target.value;
    const updateEntry = {
      key,
      value: this.state.itemsToAdd[key]
    };
    this.props.addField(updateEntry);
    const form = this.state.itemsToAdd;
    form[key] = '';
    this.setState({ form })
  }

  render() {
    return (
      <Grid padded>
        <Grid.Row>
          <Dropdown
            placeholder="Select Task Type"
            selection
            fluid
            name="issuetype"
            value={this.props.selected}
            onChange={this.props.onChange}
            options={this.props.tasks.map(task => Object.assign({}, { text: task.name, value: task.name, image: task.iconUrl, id: task.key }))}
          />
        </Grid.Row>
        <Grid.Row />
        <Grid.Row>
          <TaskForm
            optionalFields={this.props.fetchOptions()}
            onChange={this.trackTaskForm}
            taskList={this.state.itemsToAdd}
            onSubmit={this.addEntry}
          /><br />
          <button onClick={this.props.jiraSubmit}>Create Board</button>
        </Grid.Row>
      </Grid>
    );
  }
}

export default SelectTask;
