import { LOGIN } from '../actions/actionTypes';

export type loginStateType = {
  +loggedIn: boolean,
}

type actionType = {
  +type: string
}

export default function login(state: boolean = false, action: actionType) {
  switch (action.type) {
    case LOGIN:
      return state = !state;
    default:
      return state;
  }
}