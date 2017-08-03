
// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.css';
import AddListForm from './AddListModal';
import BoardList from './BoardList';
import CheckListPanel from './CheckListPanel';
import { ipcRenderer } from 'electron';
import { exportRawData } from '../lib/Sprint';
import * as Jira from '../lib/Jira';

ipcRenderer.on('selected-directory', (event, args) => {
  if (args.dir) {
    exportRawData(args.dir, args.data);
  }
});

type Props = {
  addTrelloList: () => void,
  lists: Object,
  boards: Array<mixed>
}

class Home extends Component<void, Props, void> {
  constructor(props) {
    super(props);
    this.state = {
      boards: this.props.boards, 
      board: {boardId: '', listName: ''},
      selectedStory: {},
      errors: {addList: ''},
      showAddList: false
    };

    this.test = this.test.bind(this);
    this.exportList = this.exportList.bind(this);
    this.toggleAddList = this.toggleAddList.bind(this);
    this.updateBoardsState = this.updateBoardsState.bind(this);
    this.trackList = this.trackList.bind(this);
    this.selectActiveStory = this.selectActiveStory.bind(this);
  }

  componentDidMount() {
    this.props.loadBoards();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.boards !== nextProps.boards) {
      this.setState({boards: nextProps.boards});
    }
  }

  test(event) {
    event.preventDefault();
    Jira.createTask(this.props.boards, this.props.lists);
  }

  updateBoardsState(event) {
    const field = event.target.name;
    let boards = this.state.board;
    boards[field] = event.target.value;
    return this.setState({board: boards});
  }

  selectActiveStory(event) {
    let activeStory = event.target.id.split(' ');
    this.props.lists[activeStory[0]].map(checklist => {
      if(checklist.id === activeStory[1]) {
        this.setState({selectedStory: checklist})
      }
    });
  }

  toggleAddList(event) {
    event.preventDefault();
    this.setState({showAddList: !this.state.showAddList})
  }

  exportList(event) {
    const list = this.props.lists[event.target.value];
    ipcRenderer.send('open-dialog', list);
  }

  trackList(event) {
    event.preventDefault();
    this.props.addTrelloList(this.state.board.boardId, this.state.board.listName);
  }

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2 onClick={this.test}>Sprint Hub</h2>
          <nav>
            <Link to="/login">To Login</Link>
            <button onClick={this.toggleAddList}>Add List</button>
          </nav>
          <BoardList
            boards={this.props.boards}
            lists={this.props.lists}
            mapCards={this.props.mapCards}
            removeTrelloList={this.props.removeTrelloList}
            selectedStory={this.state.selectedStory}
            selectActiveStory={this.selectActiveStory}
            exportList={this.exportList} />
          { this.state.showAddList &&
            <AddListForm
              boards={this.state.board}
              togglePop={this.toggleAddList}
              onChange={this.updateBoardsState}
              onSubmit={this.trackList}
              errors={this.state.errors} />
          }
        </div>
        {Object.keys(this.state.selectedStory).length !== 0 && 
            <CheckListPanel checklists={this.state.selectedStory} />
        }
      </div>
    );
  }
}

export default Home;          // <Link to="/counter">to Counter</Link>
