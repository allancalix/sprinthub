// @flow
import React from 'react';
import styles from './css/CardList.css';

type Props = {
  selectActiveStory: () => void,
  id: string,
  cards: Object,
  selectedStory: Object
};

const CardList = ({ id, cards, selectedStory, selectActiveStory }: Props) => (
  <div>
    {cards[id].map(cardList =>
      (<li
        onClick={selectActiveStory}
        key={cardList.id}
        id={`${id} ${cardList.id}`}
        className={selectedStory.id === cardList.id ? styles.active : styles.inactive}
      >{cardList.name}</li>)
    )}
  </div>
);

export default CardList;
