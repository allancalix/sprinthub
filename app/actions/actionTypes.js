// @flow
export type actionType = {
  +type: string
};

// login.js
// export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const SET_STATUS = 'SET_STATUS';
export const SET_TRELLO_TOKEN_SUCCESS = 'SET_TRELLO_TOKEN_SUCCESS';
export const SET_TRELLO_TOKEN_FAILURE = 'SET_TRELLO_TOKEN_FAILURE';

// user.js
export const LOAD_BOARDS_SUCCESS = 'LOAD_BOARDS_SUCCESS';
export const ADD_TRELLO_LIST_SUCCESS = 'ADD_TRELLO_LIST_SUCCESS';
export const REMOVE_TRELLO_LIST_SUCCESS = 'REMOVE_TRELLO_LIST_SUCCESS';

// list.js
export const MAP_CARDS_SUCCESS = 'MAP_CARDS_SUCCESS';
export const ADD_LIST_PENDING = 'ADD_LIST_PENDING';

// jiraForm.js
export const GET_OPTIONS_SUCCESS = 'GET_OPTIONS_SUCCESS';
export const GET_FIELDS_SUCCESS = 'GET_FIELDS_SUCCESS';
export const GET_OPTIONS_FAILURE = 'GET_OPTIONS_FAILURE';
export const LOGIN_PENDING = 'LOGIN_PENDING';