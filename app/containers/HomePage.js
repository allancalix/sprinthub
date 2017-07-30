// @flow
import Home from '../components/Home';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import * as UserActions from '../actions/user';
import * as LoginActions from '../actions/login';

function mapStateToProps(state) {
  return {
    user: state.user,
    loggedIn: state.login,
  }
}

function mapDispatchtoProps(dispatch) {
  return bindActionCreators(Object.assign({}, UserActions, LoginActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchtoProps)(Home);