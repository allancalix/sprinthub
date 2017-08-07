// @flow
import type { jiraFormStateType, actionType } from '../reducers/jiraForm';
import * as types from './actionTypes';
import Jira from '../lib/Jira';

export function getOptionsSuccess(options) {
  return { type: types.GET_OPTIONS_SUCCESS, options };
}

export function getFieldsSuccess(fields) {
  return { type: types.GET_FIELDS_SUCCESS, fields };
}

export function getOptions({ domain, project, username, password }) {
  return (dispatch: (action: actionType) => void) => (
    Jira.fetchIssueFields({ domain, project, username, password }, data =>
      dispatch(getOptionsSuccess(Object.assign(
        {},
        data,
        { stateSet: true },
        { domain, project, username, password })
      ))
    )
  );
}

export function getFields({ domain, project, username, password, issuetype }) {
  return (dispatch: (action: actionType) => void, getState: () => void) => (
    Jira.fetchExtendedFields({ domain, project, username, password, issuetype }, data => {
      const optionsMap = getState().jiraForm.optionsMap;
      dispatch(getFieldsSuccess(Object.assign({},
        optionsMap,
        data
      )));
    })
  );
}

export function createJiraForm(boards, lists, form) {
  return (dispatch: (action: actionType) => void) => (
    Jira.createTask(boards, lists, form, data => {
      console.log(data);
    })
      // dispatch(createJiraFormSuccess());
  );
}
