// @flow
import React, { Component } from 'react';
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
      <div>
        <select name="issuetype" value={this.props.selected} onChange={this.props.onChange}>
          <option value={''} disabled> -- Select Task Type -- </option>
          {this.props.tasks.map(task =>
            <option key={task.id} value={task.name}>{task.name}</option>
          )}
        </select>
        <TaskForm
          optionalFields={this.props.fetchOptions()}
          onChange={this.trackTaskForm}
          taskList={this.state.itemsToAdd}
          onSubmit={this.addEntry}
        /><br />
        <button onClick={this.props.jiraSubmit}>Create Board</button>
      </div>
    );
  }
}

export default SelectTask;
