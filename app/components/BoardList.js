// @flow
import React, { Component } from 'react';
import TrackedLists from './TrackedLists';
import styles from './BoardList.css';

class BoardList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boards: [...this.props.boards],
      lists: Object.assign({}, this.props.lists)
    }

    this.removeList = this.removeList.bind(this);
  }

  props: {
    removeTrelloList: () => void,
    mapCards: () => void,
    lists: Object,
    boards: Array<mixed>
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.boards !== nextProps.boards) {
      this.setState({boards: nextProps.boards});
      let listArray = [];
      nextProps.boards.map(board => {
        listArray = [
          ...listArray, 
          ...board.trelloLists.map(trelloList => 
            trelloList.trelloId)
        ]
      });
      this.props.mapCards(listArray); 
    }
  }

  removeList(event) {
    event.preventDefault();
    let list = event.target.value.split(' ');
    this.props.removeTrelloList(list[0], list[1]);
  }

  render() { 
    return (
      <div>
        {this.state.boards.map(board => 
          <ul className={styles.boardList} key={board.boardId}>
            <h3>{board.boardId}</h3>
            <TrackedLists
              boardId={board.boardId}
              lists={board.trelloLists}
              cards={this.props.lists}
              toRemove={this.removeList}
              exportList={this.props.exportList}
              selectedStory={this.props.selectedStory}
              selectActiveStory={this.props.selectActiveStory} />
          </ul>
        )}
      </div>
    );
  }
}

export default BoardList;
