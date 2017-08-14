// @flow
import React from 'react';
import { Header, Form, Modal, Button } from 'semantic-ui-react';

type Props = {
  onChange: () => void,
  onSubmit: () => void,
  boards: Object,
  errors: Object
};

const AddListForm = ({ boards, onChange, onSubmit, errors }: Props) => (
  <Modal trigger={<Button primary>Add List</Button>} closeIcon size="mini">
    <Header content="Add A List" />
    <Modal.Content>
      <Form onSubmit={onSubmit}>
        <Form.Input
          name="boardId"
          label="Board ID"
          placeholder="Board ID"
          value={boards.boardId}
          onChange={onChange}
        />
        <Form.Input
          name="listName"
          label="List Name: "
          placeholder="EX: Sprint 3"
          value={boards.listName}
          onChange={onChange}
        />
        <Button primary fluid size="small">Add</Button>
      </Form>
    </Modal.Content>
  </Modal>
);

export default AddListForm;
