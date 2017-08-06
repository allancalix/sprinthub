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
    {optionalFields.map(field =>
      [<h4 key={field.key}>{field.name}</h4>,
        field.schema.type === 'array' && <input type="text" />
      ]
    )}
  </div>
);

export default TaskForm;
