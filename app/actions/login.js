// @flow
import  type { loginStateType } from '../reducers/login';
import * as types from './actionTypes';
import Sprint from '../lib/Sprint';

export function setStatus(loginStatus) {
  return { type: types.SET_STATUS, loginStatus }
}

export function setTrelloTokenSuccess() {
  return { type: types.SET_TRELLO_TOKEN_SUCCESS }
}

export function setTrelloTokenFailure() {
  return { type: types.SET_TRELLO_TOKEN_FAILURE }
}

export function setTrelloToken(token) {
  return (dispatch: (action: actionType) => void) => {
    return Sprint.activateTrello(token).then(() => {  
      dispatch(setTrelloTokenSuccess())
    }).catch(() => {
      dispatch(setTrelloTokenFailure())
    });
  }
}

export function loadStatus() {
  return (dispatch: (action: actionType) => void) => {
      const loginStatus = Sprint.isTrelloTokenSet();
      dispatch(setStatus(loginStatus));
  }
}
