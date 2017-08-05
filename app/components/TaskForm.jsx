// @flow
import React from 'react';

type optionalFieldsType = {
  required: boolean,
  name: string,
  schema: Object,
  key: string,
  hasDefaultValue: boolean
};

type Props = {
  optionalFields: Array<optionalFieldsType>
};

const TaskForm = ({ optionalFields }: Props) => (
  <div>
    <select>
      {optionalFields.map(field =>
        <option key={field.key}>{field.name}</option>
      )}
    </select>
  </div>
);

export default TaskForm;
