// @flow
import { find, flow, remove, get } from 'lodash/fp';
import type { boardsStateType } from '../reducers/boards';
import * as types from './actionTypes';
import Sprint from '../lib/Sprint';

export function loadBoardsSuccess(boards) {
  return { type: types.LOAD_BOARDS_SUCCESS, boards };
}

export function addTrelloListSuccess(boards) {
  return { type: types.ADD_TRELLO_LIST_SUCCESS, boards };
}

export function removeTrelloListSuccess(boards) {
  return { type: types.REMOVE_TRELLO_LIST_SUCCESS, boards };
}

export function loadBoards() {
  return (dispatch: (action: actionType) => void) => {
    return Sprint.returnTrackedBoards().then(boards => {
      dispatch(loadBoardsSuccess(boards));
      }).catch(error => {
        // console.log(error);
      });
  };
}

export function addTrelloList(boardId, listName) {
  return (dispatch: (action: actionType) => void, getState) => {
    return Sprint.trackNewList(boardId, listName).then(success => {  
      let newState = getState().boards.map(board => {
        board.trelloLists = board.boardId === boardId ? 
          [...board.trelloLists, {name: listName, trelloId: success.id}] : board.trelloLists
        return board;
      });
      console.log(success);
      if(success.newBoard) { dispatch(loadBoards()) };
      dispatch(addTrelloListSuccess(newState))
    }).catch(error => {
      // console.log(error);
    });
  };
}

export function removeTrelloList(boardId, listId) {
  return (dispatch: (action: actionType) => void, getState) => {
    const boardState = getState();
    return Sprint.removeTrelloList(boardId, listId).then(message => {
      let reducedList = flow(
        find(['boardId', boardId]), 
        get('trelloLists'),
        remove({trelloId: listId})
      )(boardState.boards);
      const newState = boardState.boards.map(board =>
       board.boardId === boardId ? Object.assign(board, {trelloLists: reducedList}) : board
      );
      message === 'removedEmptyBoard' ?
        dispatch(loadBoards()) : dispatch(removeTrelloListSuccess(newState));
    }).catch(error => {
      console.log(error);
    });
  };
}
