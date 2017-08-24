// @flow
import { MAP_CARDS_SUCCESS, ADD_LIST_PENDING } from '../actions/actionTypes';

export type listsStateType = Object;

type actionType = {
  +type: string
};

export default function lists(state: Object = Object.assign({},
{ addListPending: false }), action: actionType) {
  switch (action.type) {
    case MAP_CARDS_SUCCESS:
      return action.cards;
    case ADD_LIST_PENDING:
      return Object.assign({}, state, { addListPending: action.isPending });
    default:
      return state;
  }
}
