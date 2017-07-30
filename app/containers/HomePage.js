// @flow
import Home from '../components/Home';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import * as BoardsActions from '../actions/boards';
import * as ListActions from '../actions/list';

function mapStateToProps(state) {
  return {
    boards: state.boards,
    lists: state.list
  }
}

function mapDispatchtoProps(dispatch) {
  return bindActionCreators(Object.assign({}, BoardsActions, ListActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchtoProps)(Home);