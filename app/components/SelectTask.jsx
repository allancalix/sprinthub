// @flow
import React, { Component } from 'react';
import { Grid, Dropdown, Container } from 'semantic-ui-react';
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
  addField: () => void
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

  addAllowedValue = (event: { preventDefault: () => void }, data: Object) =>
    this.props.addField({ key: data.name, value: data.value })

  addEntry = (fieldKey: string) => {
    const key = fieldKey;
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
      <Container>
        <Dropdown
          style={{ maxWidth: '400px', margin: 'auto' }}
          placeholder="Select Task Type"
          selection
          fluid
          name="issuetype"
          value={this.props.selected}
          onChange={this.props.onChange}
          options={this.props.tasks.map(task => Object.assign({}, { text: task.name, value: task.name, image: task.iconUrl, id: task.key }))}
        />
        <Grid padded relaxed stackable>
          <TaskForm
            optionalFields={this.props.fetchOptions()}
            onChange={this.trackTaskForm}
            selectValue={this.addAllowedValue}
            taskList={this.state.itemsToAdd}
            onSubmit={this.addEntry}
          />
        </Grid>
      </Container>
    );
  }
}

export default SelectTask;
