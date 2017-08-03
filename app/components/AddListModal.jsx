// @flow
import React from 'react';
import TextInput from './common/TextInput';
import styles from './css/AddListModal.css';

type Props = {
  onChange: () => void,
  onSubmit: () => void,
  boards: Object,
  errors: Object
};

const AddListForm = ({ boards, onChange, onSubmit, errors }: Props) => (
  <form onSubmit={onSubmit} className={styles.form}>
    <h3>Add A List</h3>
    <TextInput
      name="boardId"
      label="Board ID: "
      placeholder="Board ID"
      value={boards.boardId}
      onChange={onChange}
      error={errors.addList}
    />
    <TextInput
      name="listName"
      label="List Name: "
      placeholder="EX: Sprint 3"
      value={boards.listName}
      onChange={onChange}
      error={errors.addList}
    />
    <input type="submit" name="Submit" />
  </form>
);

export default AddListForm;
