// @flow
import React from 'react';
import { List, Modal, Image, Label, Icon, Grid } from 'semantic-ui-react';
import styles from './css/CheckListPanel.css';

type Props = {
  open: () => void,
  checklists: Object
};

const CheckListPanel = ({ checklists, open }: Props) => (
  <div className={styles.checkListView}>
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
          <Grid centered padded>
            {checklists.attachments.map(item => {
              return (
                <Grid.Column key={item.id} verticalAlign="middle" width={4}>
                  {item.previews.length > 0
                    ? <Modal basic trigger={<Image fluid src={item.previews[3].url} />}>
                      <Modal.Content>
                        <Image src={item.url} />
                      </Modal.Content>
                    </Modal>
                    : <Label
                      key={item.id}
                      as="a"
                      size="small"
                      onClick={() => open(item.url)}
                    >
                      <Icon name="external share" />
                      {item.name}
                    </Label>
                  }
                </Grid.Column>
              );
            })}
          </Grid>
        </List.Content>
      </List.Item>
    </List>
  </div>
);

export default CheckListPanel;
