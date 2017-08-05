// @flow
import React from 'react';

type taskType = {
  id: string,
  name: string,
  iconUrl: string
};

type Props = {
  tasks: Array<taskType>,
  onChange: () => void
};

const SelectTask = ({ tasks, onChange }: Props) => (
  <div>
    <p>Please select a task type for stories</p>
    <select name="issuetype" onChange={onChange}>
      {tasks.map(task =>
        <option key={task.id} value={task.id}>{task.name}</option>
      )}
    </select>
  </div>
);

export default SelectTask;
