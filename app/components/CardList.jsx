// @flow
import React from 'react';
import { List, Button } from 'semantic-ui-react';
import styles from './css/CardList.css';

type Props = {
  selectActiveStory: () => void,
  toRemove: () => void,
  exportList: () => void,
  boardId: string,
  cards: Object,
  selectedStory: Object,
  list: Object
};

const CardList = ({
  cards,
  selectedStory,
  selectActiveStory,
  list,
  toRemove,
  exportList,
  boardId }: Props
) => (
  <List divided selection celled animated verticalAlign="middle">
    <List.Header className={styles.sideBarHeader} icon="remove">
      <span>{list.name}</span>
      <Button.Group size="mini" compact basic>
        <Button onClick={() => exportList(list.trelloId)} icon="save" />
        <Button onClick={() => toRemove(boardId, list.trelloId)} icon="remove" />
      </Button.Group>
    </List.Header>
    {cards[list.trelloId].map(cardList =>
      (<List.Item
        active={cardList.id === selectedStory.id}
        onClick={() => selectActiveStory(list.trelloId, cardList.id)}
        key={cardList.id}
        className={styles.sideBarItem}
      >
        <List.Content floated="right">
          <List.Icon name="chevron right" />
        </List.Content>
        <List.Content>{cardList.name}</List.Content>
      </List.Item>)
    )}
  </List>
);

export default CardList;
