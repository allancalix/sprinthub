// @flow
import React, { PropTypes } from 'react';
import CardList from './CardList';

const TrackedLists = ({boardId, lists, cards, toRemove}) => {
  return (
    <div>
      {lists.map(list => 
        <li key={list.trelloId}>
          {list.name}
          <button value={`${boardId} ${list.trelloId}`} onClick={toRemove}>Remove</button>
          <CardList
            id={list.trelloId}
            cards={cards} />
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
