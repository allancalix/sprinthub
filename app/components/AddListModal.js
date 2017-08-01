// @flow
import React from 'react';
import TextInput from './common/TextInput';

type Props = {
  onChange: () => void,
  onSubmit: () => void,
  boards: Object,
  errors: Object
}

const AddListForm = ({boards, onChange, onSubmit, errors}: Props) => {
  return (
    <form onSubmit={onSubmit}>
      <TextInput
        name='boardId'
        label='Board ID: '
        placeholder='Board ID'
        value={boards.boardId}
        onChange={onChange}
        error={errors.addList} />
      <TextInput
        name='listName'
        label='List Name: '
        placeholder='EX: Sprint 3'
        value={boards.listName}
        onChange={onChange}
        error={errors.addList} />
      <input type="submit" name="Submit"/>
    </form>
  );
}

export default AddListForm;
