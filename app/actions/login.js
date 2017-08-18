// @flow
import * as types from './actionTypes';
import Sprint from '../lib/Sprint';

export function setStatus(loginStatus: boolean) {
  return { type: types.SET_STATUS, loginStatus };
}

export function setTrelloTokenSuccess() {
  return { type: types.SET_TRELLO_TOKEN_SUCCESS };
}

export function setTrelloTokenFailure() {
  return { type: types.SET_TRELLO_TOKEN_FAILURE };
}

export function setTrelloToken(token: string) {
  return (dispatch: (action: types.actionType) => void) => (
    Sprint.activateTrello(token).then(() =>
      dispatch(setTrelloTokenSuccess())
    ).catch(() =>
      dispatch(setTrelloTokenFailure())
    )
  );
}

export function loadStatus() {
  return (dispatch: (action: types.actionType) => void) => {
    const loginStatus = Sprint.isTrelloTokenSet();
    dispatch(setStatus(loginStatus));
  };
}
