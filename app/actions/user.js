import  type { userStateType } from '../reducers/user';
import * as types from './actionTypes';
import Sprint from '../lib/Sprint';
import { find, flow, remove, get } from 'lodash/fp';

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
      console.log(error);
      });
  }
}

export function addTrelloList(boardId, listName) {
  return (dispatch: (action: actionType) => void, getState) => {
    const state = getState().user;
    return Sprint.trackNewList(boardId, listName).then(id => {
      let newState = state.map(board => {
        board.trelloLists = board.boardId === boardId ? 
          [...board.trelloLists, {name: listName, trelloId: id}] : board.trelloLists
        return board;
      });
      dispatch(addTrelloListSuccess(newState))
    }).catch(error => {
      console.log(error);
    });
  }
}

export function removeTrelloList(boardId, listId) {
  return (dispatch: (action: actionType) => void, getState) => {
    const boardState = getState();
    return Sprint.removeTrelloList(boardId, listId).then(() => {
      let reducedList = flow(
        find(['boardId', boardId]), 
        get('trelloLists'),
        remove({trelloId: listId})
      )(boardState.user);
      let newState = boardState.user.map(board =>
       board.boardId === boardId ? Object.assign(board, {trelloLists: reducedList}) : board
      );
      dispatch(removeTrelloListSuccess(newState))
    }).catch(error => {
      console.log(error);
    });
  }
}
