import  type { listsStateType } from '../reducers/list';
import * as types from './actionTypes';
import Sprint from '../lib/Sprint';
import { find, flow, remove, get } from 'lodash/fp';

export function mapCardsSuccess(cards) {
  return { type: types.MAP_CARDS_SUCCESS, cards };
}


export function mapCards(lists) {
  return (dispatch: (action: actionType) => void) => {
    return Sprint.fetchCards(lists).then(data => {
      const newState = {};
      lists.map(listId => {
        try {
          newState[listId] = data[lists.indexOf(listId)][200]
        } catch (e) {
          newState[listId] = 'Error fetching data from server'
        } 
      });
      dispatch(mapCardsSuccess(newState));
      }).catch(error => {
      console.log(error);
      });
  }
}

