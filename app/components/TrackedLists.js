// @flow
import React from 'react';
import CardList from './CardList';

type Props = {
  toRemove: () => void,
  boardId: string,
  lists: Array,
  cards: Object
}

const TrackedLists = ({boardId, lists, cards, toRemove, selectedStory, selectActiveStory, exportList}: Props) => {
  return (
    <div>
      {lists.map(list => 
        <li key={list.trelloId}>
          <ul>
            <h3>{list.name}</h3>
            <button value={`${boardId} ${list.trelloId}`} onClick={toRemove}>Remove</button>
            <button value={`${list.trelloId}`} onClick={exportList}>export</button>
            <CardList
              id={list.trelloId}
              cards={cards}
              selectedStory={selectedStory}
              selectActiveStory={selectActiveStory} />
          </ul>
        </li>
      )}
    </div>
  );
}

export default TrackedLists;