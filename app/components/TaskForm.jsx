// @flow
import React from 'react';
import TextInput from './common/TextInput';
import styles from './css/TaskForm.css';

type optionalFieldsType = {
  required: boolean,
  name: string,
  schema: Object,
  key: string,
  hasDefaultValue: boolean
};

type Props = {
  optionalFields: Array<optionalFieldsType>,
};

const TaskForm = ({ optionalFields, taskList, onChange, onSubmit }: Props) => (
  <div>
    {optionalFields.map(field =>
      field.schema.type === 'array' &&
      <div key={field.key}>
        <TextInput
          label={field.name}
          name={field.key}
          placeholder={''}
          value={taskList[field.key] || ''}
          onChange={onChange}
          error={''}
        />
        <button value={field.key} onClick={onSubmit}>Add</button>
      </div>
    )}
  </div>
);

export default TaskForm;
