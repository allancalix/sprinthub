// @flow
import React, { Component } from 'react';
import { List, Confirm } from 'semantic-ui-react';
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
      lists: Object.assign({}, this.props.lists),
      showConfirm: false,
      pendingItems: {}
    };
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

  confirmRemoveList = (boardId, listId) =>
    this.setState({ showConfirm: true, pendingItems: { boardId, listId } })

  clearConfirm = () =>
    this.setState({ showConfirm: false, pendingItems: {} })

  removeList = () => {
    this.props.removeTrelloList(this.state.pendingItems);
    return this.clearConfirm();
  }

  render() {
    return (
      <div className={styles.boardPanel}>
        <Confirm
          open={this.state.showConfirm}
          content="Are you sure you want to remove this item?"
          onCancel={this.clearConfirm}
          onConfirm={this.removeList}
        />
        {this.state.boards.map(board => (
          <List key={board.boardId}>
            <List.Header className={styles.boardInfo}>
              <h2>{board.boardName}<span>{board.boardId}</span></h2>
            </List.Header>
            <TrackedLists
              boardId={board.boardId}
              lists={board.trelloLists}
              cards={this.props.lists}
              toRemove={this.confirmRemoveList}
              exportList={this.props.exportList}
              selectedStory={this.props.selectedStory}
              selectActiveStory={this.props.selectActiveStory}
            />
          </List>
        ))}
      </div>
    );
  }
}

export default BoardList;
