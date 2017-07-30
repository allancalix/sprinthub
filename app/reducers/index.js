// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import boards from './boards';
import login from './login';
import list from './list';

const rootReducer = combineReducers({
  boards,
  login,
  list,
  router,
});

export default rootReducer;
