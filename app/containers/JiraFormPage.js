// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import JiraForm from '../components/JiraForm';
import * as JiraFormActions from '../actions/jiraForm';

function mapStateToProps(state) {
  return {
    jiraFormj: state.jiraForm,
    boards: state.boards
  };
}

function mapDispatchtoProps(dispatch) {
  return bindActionCreators(Object.assign({}), JiraFormActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchtoProps)(JiraForm);
