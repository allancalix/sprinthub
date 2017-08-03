// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import JiraForm from '../components/JiraForm';

function mapStateToProps(state) {
  return {
    options: {},
  };
}

function mapDispatchtoProps(dispatch) {
  return bindActionCreators(Object.assign({}), dispatch);
}

export default connect(mapStateToProps, mapDispatchtoProps)(JiraForm);
