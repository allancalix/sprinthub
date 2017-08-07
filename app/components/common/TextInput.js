// @flow
import React from 'react';
import styles from './TextInput.css';

type Props = {
  name: string,
  label: string,
  onChange: () => void,
  placeholder: string,
  value: string,
  error: string
};

const TextInput = ({ name, label, onChange, placeholder, value, error }: Props) => {
  return (
    <div className={styles.floatingLabel}>
      <label htmlFor={name}>{label}</label><br />
      <input
        type={name === 'password' ? 'password' : 'text'}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default TextInput;
