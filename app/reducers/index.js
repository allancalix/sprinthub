// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import user from './user';
import login from './login';
import list from './list';

const rootReducer = combineReducers({
  user,
  login,
  list,
  router,
});

export default rootReducer;
