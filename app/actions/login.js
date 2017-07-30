import  type { loginStateType } from '../reducers/login';
import * as types from './actionTypes';

export function login() {
  return { type: types.LOGIN };
}
