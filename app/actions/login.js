// @flow
import  type { loginStateType } from '../reducers/login';
import * as types from './actionTypes';

export function loginSuccess() {
  return { type: types.LOGIN_SUCCESS };
}

// export function login(credentials) {
//   return (dispatch: (action: actionType) => void) => {
//     return 
//   }
// }
