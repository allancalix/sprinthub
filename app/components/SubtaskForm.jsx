// @flow
import React from 'react';
import { Table, Button, Dropdown, Input } from 'semantic-ui-react';
import { forOwn } from 'lodash';

type Props = {
  subtaskList: Array
};

const arrayify = subtaskIndex => {
  let array = [];
  forOwn(subtaskIndex, (value, key) => {
    array = [{ label: value.label, type: value.issuetype, id: key }, ...array];
  });
  return array;
};

const SubtaskForm = ({ subtaskList, onChange, pendingSubtask, selectSubtaskType, addSubtask, trackedSubtasks }: Props) => (
  <Table compact celled style={{ fontSize: '1.8em' }}>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Discipline ID</Table.HeaderCell>
        <Table.HeaderCell>Subtask Type</Table.HeaderCell>
        <Table.HeaderCell>Title Prefix</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {arrayify(trackedSubtasks).map(entry => (
        <Table.Row key={entry.id}>
          <Table.Cell>{entry.id}</Table.Cell>
          <Table.Cell>{entry.type}</Table.Cell>
          <Table.Cell>{entry.label}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
    <Table.Row>
      <Table.Cell>
        <Input
          type="text"
          label="New Label ID"
          name="id"
          value={pendingSubtask.id || ''}
          placeholder="Example: QA"
          onChange={onChange}
        />
      </Table.Cell>
      <Table.Cell>
        <Dropdown
          placeholder="Select Subtask Type"
          selection
          fluid
          onChange={selectSubtaskType}
          value={pendingSubtask.issuetype.value}
          name="issuetype"
          options={subtaskList.map(task => Object.assign({},
            {
              text: task.name,
              value: task.name,
              image: task.iconUrl,
              id: task.id
            }
          ))}
        />
      </Table.Cell>
      <Table.Cell>
        <Input
          type="text"
          label="Title"
          name="title"
          value={pendingSubtask.title || ''}
          placeholder="QA:"
          onChange={onChange}
        />
      </Table.Cell>
    </Table.Row>
    <Table.Footer fullWidth>
      <Table.Row colSpan="3">
        <Button onClick={addSubtask} size="small">Add Discipline</Button>
      </Table.Row>
    </Table.Footer>
  </Table>
);

export default SubtaskForm;
