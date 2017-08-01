// @flow
import Login from '../components/Login';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import LoginActions from '../actions/login';

function mapStateToProps(state) {
  return {
    login: state.login
  }
}

function mapDispatchtoProps(dispatch) {
  return bindActionCreators(Object.assign({}, LoginActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchtoProps)(Login);