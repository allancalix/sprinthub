// @flow
import React, { PropTypes } from 'react';
import TrackedLists from './TrackedLists';
import styles from './CardList.css';

const CardList = ({id, cards, selectedStory, selectActiveStory}) => {
  return (
    <div>
      {cards[id].map(cardList =>
        <li 
          key={cardList.id}
          id={`${id} ${cardList.id}`}
          onClick={selectActiveStory}
          className={selectedStory.id === cardList.id ? styles.active : styles.inactive}>
            {cardList.name}
        </li>
      )}
    </div>
  );
}

CardList.propTypes = {
  id: PropTypes.string.isRequired,
  cards: PropTypes.object.isRequired
}

export default CardList;