// @flow
import React from 'react';
import { List, Container } from 'semantic-ui-react';
import ImagePreview from './ImagePreview';
import styles from './css/CheckListPanel.css';

type Props = {
  open: () => void,
  checklists: Object
};

const CheckListPanel = ({ checklists, open }: Props) => (
  <Container fluid className={styles.checkListView}>
    <h1>{checklists.name}</h1>
    <List divided relaxed>
      {checklists.checklists.map(checklist =>
        (<List.Item key={checklist.id}>
          <List.Header as="h2">{checklist.name}</List.Header>
          <List ordered relaxed>
            {checklist.checkItems.map(criteria =>
              <List.Item className={styles.criteria} key={criteria.id}>{criteria.name}</List.Item>
            )}
          </List>
        </List.Item>)
      )}
      <List.Item>
        <List.Header as="h2">Attachments</List.Header>
        <List.Content>
          <ImagePreview attachments={checklists.attachments} open={open} />
        </List.Content>
      </List.Item>
    </List>
  </Container>
);

export default CheckListPanel;
