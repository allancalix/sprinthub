// @flow
import {
  SET_STATUS,
  SET_TRELLO_TOKEN_SUCCESS,
  SET_TRELLO_TOKEN_FAILURE,
} from '../actions/actionTypes';

export type loginStateType = {
  +loggedIn: boolean
};

type actionType = {
  +type: string
};

export default function login(state: boolean = false, action: actionType) {
  switch (action.type) {
    case SET_STATUS:
      return action.loginStatus;
    case SET_TRELLO_TOKEN_SUCCESS:
      return true;
    case SET_TRELLO_TOKEN_FAILURE:
      return false;
    default:
      return state;
  }
}
