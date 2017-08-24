// @flow
import { find, flow, remove, get } from 'lodash/fp';
import  type { listsStateType } from '../reducers/list';
import * as types from './actionTypes';
import Sprint from '../lib/Sprint';

export function mapCardsSuccess(cards) {
  return { type: types.MAP_CARDS_SUCCESS, cards };
}

export function mapCardsFailure() {
  return { type: types.MAP_CARDS_FAILURE, };
}

export function addListPending(isPending) {
  return { type: types.ADD_LIST_PENDING, isPending };
}

export function mapCards(lists: listsStateType) {
  return (dispatch: (action: actionType) => void) => {
    return Sprint.fetchCards(lists).then(data => {
      const newState = {};
      lists.map(listId => {
        try {
          newState[listId] = data[lists.indexOf(listId)][200];
        } catch (e) {
          newState[listId] = 'Error fetching data from server';
        }
      });
      dispatch(mapCardsSuccess(newState));
    }).catch(error => {
      console.log(error);
    });
  };
}

