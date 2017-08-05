// @flow
import { GET_OPTIONS_SUCCESS } from '../actions/actionTypes';

export type jiraFormStateType = {
  +jiraForm: Object,
}

type actionType = {
  +type: string
}

export default function jiraForm(state: Object = Object.assign({}), action: actionType) {
  switch (action.type) {
    case GET_OPTIONS_SUCCESS:
      return Object.assign(state, action.options);
    default:
      return state;
  }
}