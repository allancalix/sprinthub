// @flow
import React from 'react';
import TextInput from './common/TextInput';
import styles from './css/AddListModal.css';

type Props = {
  form: {
    username: string,
    password: string,
    project: string,
    domain: string
  },
  onChange: () => void,
  onSubmit: () => void,
  errors: Object
};

const JiraLogin = ({ form, onChange, onSubmit, errors }: Props) => (
  <form onSubmit={onSubmit} className={styles.form}>
    <h3>Credentials</h3>
    <TextInput
      label={'Domain:'}
      name={'domain'}
      placeholder={'domain.jira.com'}
      value={form.domain}
      onChange={onChange}
      error={''}
    />
    <TextInput
      label={'Project:'}
      name={'project'}
      placeholder={'EXAM'}
      value={form.project}
      onChange={onChange}
      error={''}
    /><br />
    <TextInput
      name="username"
      label="Username"
      placeholder="Username"
      value={form.username}
      onChange={onChange}
      error={errors.username}
    />
    <TextInput
      name="password"
      label="Password"
      placeholder="Password"
      value={form.password}
      onChange={onChange}
      error={errors.password}
    />
    <input type="submit" name="Submit" />
  </form>
);

export default JiraLogin;
