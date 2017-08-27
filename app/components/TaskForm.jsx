// @flow
import React from 'react';
import { Grid, Input, Dropdown } from 'semantic-ui-react';

type optionalFieldsType = {
  required: boolean,
  name: string,
  schema: Object,
  key: string,
  hasDefaultValue: boolean
};

type Props = {
  optionalFields: Array<optionalFieldsType>,
  onChange: () => void,
  onSubmit: () => void,
  taskList: Object
};

const mapOptions = (values = []) =>
  values.map(value => Object.assign({}, { text: value.name, value, key: value.id }))

const TaskForm = ({ optionalFields, taskList, onChange, onSubmit, selectValue }: Props) => (
  <Grid.Row columns={3}>
    {optionalFields.map(field =>
      (field.schema.type === 'array' && field.schema.items === 'string') || field.schema.type === 'string'
      ? <Grid.Column textAlign="center" verticalAlign="middle" style={{ height: '100px' }} key={field.key}>
        <Input
          action={{ color: 'teal', labelPosition: 'right', icon: 'add', content: 'Add', onClick: () => onSubmit(field.key) }}
          name={field.key}
          placeholder={field.name}
          fluid
          value={taskList[field.key] || ''}
          style={{ fontSize: '1.6em' }}
          onChange={onChange}
        />
      </Grid.Column>
      : <Grid.Column textAlign="center" verticalAlign="middle" style={{ height: '100px' }} key={field.key}>
        <Dropdown
          fluid
          multiple
          search
          selection
          placeholder={field.name}
          style={{ fontSize: '1.6em' }}
          name={field.key}
          onChange={selectValue}
          options={mapOptions(field.allowedValues || [])}
        />
      </Grid.Column>
    )}
  </Grid.Row>
);

export default TaskForm;
        // <Button size="mini" secondary value={field.key} onClick={onSubmit}>Add</Button>
