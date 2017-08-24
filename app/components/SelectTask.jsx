// @flow
import React, { Component } from 'react';
import { Grid, Dropdown, Container } from 'semantic-ui-react';
import TaskForm from './TaskForm';
import SubtaskForm from './SubtaskForm';

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
    itemsToAdd: {},
    subtaskToAdd: {
      issuetype: {}
    }
  }

  trackTaskForm = (event: { target: { name: string, value: string } }) => {
    const field = event.target.name;
    const itemsToAdd = this.state.itemsToAdd;
    itemsToAdd[field] = event.target.value;
    return this.setState({ itemsToAdd });
  }

  trackSubtaskForm = (event: { target: { name: string, value: string } }) => {
    const field = event.target.name;
    const subtaskToAdd = this.state.subtaskToAdd;
    subtaskToAdd[field] = field === 'id'
      ? event.target.value.toUpperCase() : event.target.value;
    return this.setState({ subtaskToAdd });
  }

  selectSubtaskType = (event: { preventDefault: () => void }, data) => {
    console.log(data);
    const field = data.name;
    const subtaskToAdd = this.state.subtaskToAdd;
    for (let i = 0, j = data.options.length; i < j; i += 1) {
      if (data.options[i].value === data.value) {
        subtaskToAdd[field] = data.options[i];
      }
    }
    return this.setState({ subtaskToAdd });
  }

  addSubtask = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    this.props.pushSubtask(this.state.subtaskToAdd);
    this.setState({ subtaskToAdd: { issuetype: {} } });
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
    this.setState({ form });
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
          <Grid.Row>
            <SubtaskForm
              subtaskList={this.props.subtasks}
              onChange={this.trackSubtaskForm}
              selectSubtaskType={this.selectSubtaskType}
              pendingSubtask={this.state.subtaskToAdd}
              addSubtask={this.addSubtask}
              trackedSubtasks={this.props.trackedSubtasks}
            />
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

export default SelectTask;
