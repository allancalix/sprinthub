// @flow
import type { jiraFormStateType, actionType } from '../reducers/jiraForm';
import * as types from './actionTypes';
import Jira from '../lib/Jira';

export function getOptionsSuccess(options) {
  return { type: types.GET_OPTIONS_SUCCESS, options };
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

export function createJiraForm(boards, lists, form) {
  return (dispatch: (action: actionType) => void) => (
    Jira.createTask(boards, lists, form, data => {
      console.log(data);
    })
      // dispatch(createJiraFormSuccess());
  );
}

