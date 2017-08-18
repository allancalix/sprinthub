// @flow
import { GET_OPTIONS_SUCCESS, GET_FIELDS_SUCCESS, LOGIN_PENDING, GET_OPTIONS_FAILURE } from '../actions/actionTypes';

export type jiraFormStateType = {
  +jiraForm: Object
};

export type actionType = {
  +type: string
};

export default function jiraForm(
  state: Object = Object.assign({ stateSet: false, showLoginLoader: false, username: '', password: '', domain: '', project: '', tasks: [], optionsMap: {}, jiraLoginErrors: {} }),
  action: actionType) {
  switch (action.type) {
    case LOGIN_PENDING:
      return Object.assign({}, state, { showLoginLoader: action.status });
    case GET_OPTIONS_SUCCESS:
      return Object.assign({}, state, action.options);
    case GET_OPTIONS_FAILURE:
      return Object.assign({}, state, { jiraLoginErrors: action.jiraLoginErrors });
    case GET_FIELDS_SUCCESS:
      return Object.assign({}, state, { optionsMap: action.fields });
    default:
      return state;
  }
}
