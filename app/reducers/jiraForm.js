// @flow
import { GET_OPTIONS_SUCCESS, GET_FIELDS_SUCCESS } from '../actions/actionTypes';

export type jiraFormStateType = {
  +jiraForm: Object
};

export type actionType = {
  +type: string
};

export default function jiraForm(
  state: Object = Object.assign({ stateSet: false, username: '', password: '', domain: '', project: '', tasks: [], optionsMap: {} }),
  action: actionType) {
  switch (action.type) {
    case GET_OPTIONS_SUCCESS:
      return Object.assign({}, state, action.options);
    case GET_FIELDS_SUCCESS:
      return Object.assign({}, state, { optionsMap: action.fields });
    default:
      return state;
  }
}
