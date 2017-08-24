// @flow
import type { jiraFormStateType, actionType } from '../reducers/jiraForm';
import * as types from './actionTypes';
import Jira from '../lib/Jira';

export function getOptionsSuccess(options) {
  return { type: types.GET_OPTIONS_SUCCESS, options };
}

export function getOptionsFailure(jiraLoginErrors) {
  return { type: types.GET_OPTIONS_FAILURE, jiraLoginErrors };
}

export function getFieldsSuccess(fields) {
  return { type: types.GET_FIELDS_SUCCESS, fields };
}

export function loginPending(status) {
  return { type: types.LOGIN_PENDING, status };
}

export function getOptions({ domain, project, username, password }) {
  return (dispatch: (action: actionType) => void) => {
    dispatch(loginPending(true));
    return Jira.fetchIssueFields({ domain, project, username, password }, (error, data) => {
      dispatch(loginPending(false));
      if (error) {
        console.log(error);
        const jiraLoginErrors = {};
        for (let i = 0, j = error.fields.length; i < j; i += 1) {
          jiraLoginErrors[error.fields[i]] = error.message;
        }
        console.log(jiraLoginErrors);
        return dispatch(getOptionsFailure(jiraLoginErrors));
      }
      return dispatch(getOptionsSuccess(Object.assign(
        {},
        data,
        { stateSet: true },
        { domain, project, username, password })
      ));
    });
  };
}

export function getFields({ domain, project, username, password, issuetype }, id) {
  return (dispatch: (action: actionType) => void, getState: () => void) => (
    Jira.fetchExtendedFields({ domain, project, username, password, issuetype }, id, data => {
      const optionsMap = getState().jiraForm.optionsMap;
      dispatch(getFieldsSuccess(Object.assign({},
        optionsMap,
        data
      )));
    })
  );
}

export function createJiraForm(boards, lists, form, extras, subtaskIndex) {
  return (dispatch: (action: actionType) => void) => (
    Jira.createTask(boards, lists, form, extras, subtaskIndex, data => {
      console.log(data);
    })
      // dispatch(createJiraFormSuccess());
  );
}
