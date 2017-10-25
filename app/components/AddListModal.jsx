// @flow
import React from 'react';
import { Form, Modal, Button, Message } from 'semantic-ui-react';

type Props = {
  onChange: () => void,
  onSubmit: () => void,
  boards: Object,
  errors: Object,
  pendingResponse: boolean
};

const AddListForm = ({ boards, onChange, onSubmit, errors, pendingResponse }: Props) => (
  <Modal trigger={<Button secondary>Add List</Button>} closeIcon size="mini">
    <Modal.Header content="Add A List" />
    <Modal.Content>
      <Form success={pendingResponse} error={!pendingResponse} onSubmit={onSubmit} loading={pendingResponse}>
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
        <Message
          success
          header="List Added"
        />
        <Message
          error
          header="Oops!"
          content="There was a problem adding this list"
        />
        <Button primary fluid size="small">Add</Button>
      </Form>
    </Modal.Content>
  </Modal>
);

export default AddListForm;
