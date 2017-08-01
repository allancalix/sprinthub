// @flow
import React from 'react';

type Props = {
  name: string,
  label: string,
  onChange: () => void,
  placeholder: string,
  value: string,
  error: string
}

const TextInput = ({name, label, onChange, placeholder, value, error}: Props) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange} />
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default TextInput;