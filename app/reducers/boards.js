// @flow
import { LOAD_BOARDS_SUCCESS,
        REMOVE_TRELLO_LIST_SUCCESS,
        ADD_TRELLO_LIST_SUCCESS
        } from '../actions/actionTypes';

export type boardsStateType = {
  +boards: Array<mixed>,
}

type actionType = {
  +type: string
}

export default function boards(state: Array<mixed> = [], action: actionType) {
  switch (action.type) {
    case LOAD_BOARDS_SUCCESS:
      return action.boards; 
    case REMOVE_TRELLO_LIST_SUCCESS:
      return action.boards;
    case ADD_TRELLO_LIST_SUCCESS:
      return action.boards;
    default:
      return state;
  }
}
