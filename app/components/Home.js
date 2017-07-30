// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import AddListForm from './AddListModal';
import BoardList from './BoardList';

class Home extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      what: this.context,
      user: this.props.user, 
      boards: {},
      errors: {}
    };

    this.updateBoardsState = this.updateBoardsState.bind(this);
    this.trackList = this.trackList.bind(this);
    this.updateCards = this.updateCards.bind(this);
  }

  updateCards() {
    let listArray = [];
    this.props.user.map(board => {
      listArray = [...listArray, ...board.trelloLists.map(trelloList => trelloList.trelloId)]
    });
    this.props.mapCards(listArray);
  }

  componentDidMount() {
    this.props.loadBoards();
  }
  // componentWillReceiveProps(nextProps) {
  //   if (this.props.user !== nextProps.user) {
  //     this.setState({user: nextProps.user});
  //   }
  // }

  updateBoardsState(event) {
    const field = event.target.name;
    let boards = this.state.boards;
    boards[field] = event.target.value;
    return this.setState({boards: boards});
  }

  trackList(event) {
    event.preventDefault();
    this.props.addTrelloList(this.state.boards.boardId, this.state.boards.listName);
  }



  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2 onClick={this.updateCards}>Sprint Hub</h2>
          <BoardList />          
          <AddListForm
            boards={this.state.boards}
            cards ={this.props.lists}
            onChange={this.updateBoardsState}
            onSubmit={this.trackList}
            errors={this.state.errors} />
        </div>
      </div>
    );
  }
}

export default Home;          // <Link to="/counter">to Counter</Link>
