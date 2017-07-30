// @flow
import React, { PropTypes } from 'react';
import CardList from './CardList';

const TrackedLists = ({boardId, lists, cards, toRemove, selectedStory, selectActiveStory, exportList}) => {
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

TrackedLists.propTypes = {
  boardId: PropTypes.string.isRequired,
  lists: PropTypes.array.isRequired,
  cards: PropTypes.object.isRequired,
  toRemove: PropTypes.func.isRequired
}

export default TrackedLists;