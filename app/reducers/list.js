import { MAP_CARDS_SUCCESS
        } from '../actions/actionTypes';

export type userStateType = {
  +lists: Object,
}

type actionType = {
  +type: string
}

export default function user(state: Object = {}, action: actionType) {
  switch (action.type) {
    case MAP_CARDS_SUCCESS:
      return action.cards; 
    default:
      return state;
  }
}
