// @flow
import BoardList from '../components/BoardList';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import * as ListActions from '../actions/list';

function mapStateToProps(state) {
  return {
    lists: state.lists,
  }
}

function mapDispatchtoProps(dispatch) {
  return bindActionCreators(Object.assign({}, ListActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchtoProps)(BoardList);