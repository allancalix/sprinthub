// @flow
import React from 'react';
import { List } from 'semantic-ui-react';
import CardList from './CardList';

type Props = {
  toRemove: () => void,
  exportList: () => void,
  selectActiveStory: () => void,
  boardId: string,
  selectedStory: Object,
  cards: Object,
  lists: Object
};

const TrackedLists = ({
  boardId,
  lists,
  cards,
  toRemove,
  selectedStory,
  selectActiveStory,
  exportList }: Props) => (
    <div>
      {lists.map(list =>
        (<List.Item key={list.trelloId}>
          <CardList
            id={list.trelloId}
            cards={cards}
            selectedStory={selectedStory}
            selectActiveStory={selectActiveStory}
            list={list}
            boardId={boardId}
            exportList={exportList}
            toRemove={toRemove}
          />
        </List.Item>)
      )}
    </div>
  );

export default TrackedLists;
