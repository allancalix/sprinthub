// @flow
import { MAP_CARDS_SUCCESS
        } from '../actions/actionTypes';

export type listsStateType = {
  +lists: Object,
}

type actionType = {
  +type: string
}

export default function lists(state: Object = Object.assign({}), action: actionType) {
  switch (action.type) {
    case MAP_CARDS_SUCCESS:
      return action.cards; 
    default:
      return state;
  }
}
