// @flow
import type { jiraFormStateType, actionType } from '../reducers/jiraForm';
import * as types from './actionTypes';
import Jira from '../lib/Jira';

export function getOptionsSuccess(options) {
  return { type: types.GET_OPTIONS_SUCCESS, options };
}

// export function getOptionsFailure(errors) {
//   return { type: types.GET_OPTIONS_FAILURE, errors };
// }

export function getFieldsSuccess(fields) {
  return { type: types.GET_FIELDS_SUCCESS, fields };
}

export function getOptions({ domain, project, username, password }) {
  return (dispatch: (action: actionType) => void) => (
    Jira.fetchIssueFields({ domain, project, username, password }, (error, data) => {
      if (error) {
        const errors = error.fields.map(errorField => Object.assign({}, { field: errorField, message: error.message }));
        console.log(errors);
      } else {
        dispatch(getOptionsSuccess(Object.assign(
          {},
          data,
          { stateSet: true },
          { domain, project, username, password })
        ));
      }
    })
  );
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

export function createJiraForm(boards, lists, form, extras) {
  return (dispatch: (action: actionType) => void) => (
    Jira.createTask(boards, lists, form, extras, data => {
      console.log(data);
    })
      // dispatch(createJiraFormSuccess());
  );
}
