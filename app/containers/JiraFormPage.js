// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import JiraForm from '../components/JiraForm';
import * as JiraFormActions from '../actions/jiraForm';

function mapStateToProps(state) {
  return {
    jiraForm: state.jiraForm,
    boards: state.boards,
    list: state.list
  };
}

function mapDispatchtoProps(dispatch) {
  return bindActionCreators(Object.assign({}, JiraFormActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchtoProps)(JiraForm);
