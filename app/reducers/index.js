// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import boards from './boards';
import login from './login';
import list from './list';
import jiraForm from './jiraForm';

const rootReducer = combineReducers({
  boards,
  login,
  list,
  jiraForm,
  router,
});

export default rootReducer;
