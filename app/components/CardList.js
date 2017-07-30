// @flow
import React, { PropTypes } from 'react';
import TrackedLists from './TrackedLists';
import styles from './BoardList.css';

const CardList = ({id, cards}) => {
  return (
    <div>
      {cards.map(board => 
        <ul key={id}>
          <h3>{cards.name}</h3>
        </ul>
      )}
    </div>
  );
}

CardList.propTypes = {
  id: PropTypes.string.isRequired,
  cards: PropTypes.object.isRequired
}

export default CardList;
