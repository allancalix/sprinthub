// @flow
import React, { Component } from 'react';
import TrackedLists from './TrackedLists';
import styles from './css/BoardList.css';

type Props = {
  removeTrelloList: () => void,
  mapCards: () => void,
  lists: Object,
  boards: Array<mixed>
};

class BoardList extends Component<void, Props, void> {
  constructor(props: Props) {
    super(props);
    this.state = {
      boards: [...this.props.boards],
      lists: Object.assign({}, this.props.lists)
    };

    this.removeList = this.removeList.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.boards !== nextProps.boards) {
      this.setState({ boards: nextProps.boards });
      let listArray = [];
      nextProps.boards.map(board => {
        listArray = [
          ...listArray,
          ...board.trelloLists.map(trelloList =>
            trelloList.trelloId)
        ];
      });
      this.props.mapCards(listArray);
    }
  }

  removeList(event: { preventDefault: () => void, target: {value: string} }) {
    event.preventDefault();
    const list = event.target.value.split(' ');
    this.props.removeTrelloList(list[0], list[1]);
  }

  render() {
    return (
      <div>
        {this.state.boards.map(board =>
          <ul className={styles.boardList} key={board.boardId}>
            <h3>{board.boardName}</h3><span>{board.boardId}</span>
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
