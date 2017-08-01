// @flow
import React from 'react';
import TrackedLists from './TrackedLists';
import styles from './CardList.css';

type Props = {
  selectActiveStory: () => void,
  id: string,
  cards: Object,
  selectedStory: Object
}

const CardList = ({id, cards, selectedStory, selectActiveStory}: Props) => {

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

export default CardList;