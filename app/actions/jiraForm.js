// @flow
import  type { jiraFormStateType } from '../reducers/jiraForm';
import * as types from './actionTypes';
import Jira from '../lib/Jira';

export function getOptionsSuccess(options) {
  return { type: types.GET_OPTIONS_SUCCESS, options };
}


export function getOptions() {
  return (dispatch: (action: actionType) => void) => {
    return Jira.fetcfetchIssueFieldshCards().then(data => {
      const options = [...data.projects[0].issuetypes];      
      dispatch(getOptionsSuccess(options));
      }).catch(error => {
      console.log(error);
      });
  }
}
