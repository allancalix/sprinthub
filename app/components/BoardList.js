// @flow
import React, { Component } from 'react';
import TrackedLists from './TrackedLists';
import styles from './BoardList.css';

class BoardList extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      boards: [...props.user]
    }
  }

  // props: {
  //  lists: {
  //     name: string,
  //     labels: Array<any>,
  //     id: string,
  //     checklists: Array
  //   }
  // }

  componentWillReceiveProps(nextProps) {
    if (this.props.user !== nextProps.user) {
      this.setState({user: nextProps.user});
    }
  }

  removeList(event) {
    event.preventDefault();
    let list = event.target.value.split(' ');
    this.props.removeTrelloList(list[0], list[1]);
  }

  // {
  //   let listArray = [];
  //   this.user.map(board => {
  //     listArray = [...listArray, ...board.trelloLists.map(trelloList => trelloList.trelloId)]
  //   });
  //   this.user.mapCards(listArray); 
  // }

  render() { 
    return (
      <div>
        {this.state.boards.map(board => 
          <ul className={styles.boardList} key={board.boardId}>
            <h3>{board.boardId}</h3>
            <TrackedLists
            boardId={this.state.boards.boardId}
            cards={cards}
            toRemove={this.removeList}
            lists={this.state.boards.trelloLists} />
          </ul>
        )}
      </div>
    );
  }
}

// BoardList.propTypes = {
//   boards: PropTypes.array.isRequired,
//   toRemove: PropTypes.func.isRequired
// }

export default BoardList;
