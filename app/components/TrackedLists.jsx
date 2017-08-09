// @flow
import React from 'react';
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
        (<li key={list.trelloId}>
          <ul>
            <h3>{list.name}</h3>
            <button value={`${boardId} ${list.trelloId}`} onClick={toRemove}>Remove</button>
            <button value={`${list.trelloId}`} onClick={exportList}>Export</button>
            <CardList
              id={list.trelloId}
              cards={cards}
              selectedStory={selectedStory}
              selectActiveStory={selectActiveStory}
            />
          </ul>
        </li>)
      )}
    </div>
  );

export default TrackedLists;
