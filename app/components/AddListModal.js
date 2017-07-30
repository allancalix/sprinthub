// @flow
import React, { PropTypes } from 'react';
import TextInput from './common/TextInput';


const AddListForm = ({boards, onChange, onSubmit, errors}) => {
  return (
    <form onSubmit={onSubmit}>
      <TextInput
        name='boardId'
        label='Board ID: '
        placeholder='Board ID'
        value={boards.toAdd}
        onChange={onChange}
        error={errors.boardIdInput} />
      <TextInput
        name='listName'
        label='List Name: '
        placeholder='EX: Sprint 3'
        value={boards.list}
        onChange={onChange}
        error={errors.listNameInput} />
      <input type="submit" name="Submit"/>
    </form>
  );
}

AddListForm.propTypes = {
  boards: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
}

export default AddListForm;
