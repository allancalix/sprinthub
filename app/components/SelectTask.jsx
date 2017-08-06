// @flow
import React from 'react';
import TaskForm from './TaskForm';

type taskType = {
  id: string,
  name: string,
  iconUrl: string
};

type Props = {
  tasks: Array<taskType>,
  onChange: () => void
};

const SelectTask = ({ tasks, onChange, fetchOptions, jiraSubmit }: Props) => (
  <div>
    <p>Please select a task type for stories</p>
    <select name="issuetype" onChange={onChange}>
      {tasks.map(task =>
        <option key={task.id} value={task.id}>{task.name}</option>
      )}
    </select>
    <TaskForm optionalFields={fetchOptions()} onChange={onChange} /><br />
    <button onClick={jiraSubmit}>Create Board</button>
  </div>
);

export default SelectTask;
