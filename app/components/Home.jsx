// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import styles from './css/Home.css';
import AddListForm from './AddListModal';
import BoardList from './BoardList';
import CheckListPanel from './CheckListPanel';
import { exportRawData, authenticateTrello } from '../lib/Sprint';

const globalVar = () => {};

type Props = {
  addTrelloList: () => void,
  loadBoards: () => void,
  mapCards: () => void,
  setTrelloToken: () => void,
  loadStatus: () => void,
  removeTrelloList: () => void,
  lists: Object,
  boards: Array<mixed>,
  login: boolean
};

type State = {
  boards: Array<mixed>,
  board: {
    boardId: () => void,
    listName: string
  },
  selectedStory: Object
};

class Home extends Component<void, Props, State> {
  constructor(props) {
    super(props);

    this.toggleAddList = this.toggleAddList.bind(this);
    this.exportList = this.exportList.bind(this);
    this.updateBoardsState = this.updateBoardsState.bind(this);
    this.trackList = this.trackList.bind(this);
    this.selectActiveStory = this.selectActiveStory.bind(this);
  }

  state = {
    boards: this.props.boards,
    board: {
      boardId: '',
      listName: ''
    },
    selectedStory: {},
    errors: {
      addList: ''
    },
    showAddList: false
  }

  componentWillMount() {
    globalVar.callback = data => {
      this.props.setTrelloToken(data);
    };
  }

  componentDidMount() {
    this.props.loadBoards();
  }

  componentWillReceiveProps(nextProps: Object) {
    if (this.props.boards !== nextProps.boards) {
      this.setState({ boards: nextProps.boards });
    }
  }

  login(event: {preventDefault: () => void}) {
    event.preventDefault();
    ipcRenderer.send('trello-login', authenticateTrello());
  }

  updateBoardsState(event: { target: { name: string, value: string } }) {
    const field = event.target.name;
    const boards = this.state.board;
    boards[field] = event.target.value;
    return this.setState({ board: boards });
  }

  selectActiveStory(event: {target: {id: string } }) {
    const activeStory = event.target.id.split(' ');
    this.props.lists[activeStory[0]].map(checklist => {
      if (checklist.id === activeStory[1]) {
        return this.setState({ selectedStory: checklist });
      }
    });
  }

  toggleAddList(event: {preventDefault: () => void}) {
    event.preventDefault();
    this.setState({ showAddList: !this.state.showAddList });
  }

  exportList(event: { target: {value: string} }) {
    const list = this.props.lists[event.target.value];
    ipcRenderer.send('open-dialog', list);
  }

  trackList(event: {preventDefault: () => void}) {
    event.preventDefault();
    this.props.addTrelloList(this.state.board.boardId, this.state.board.listName);
  }

  render() {
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <h2>Sprint Hub</h2>
          <nav>
            <Link to="/jira">Make Jira Board</Link>
            {!this.props.login && <button onClick={this.login}>Login</button>}
            <button onClick={this.toggleAddList}>Add List</button>
          </nav>
          <BoardList
            boards={this.props.boards}
            lists={this.props.lists}
            mapCards={this.props.mapCards}
            removeTrelloList={this.props.removeTrelloList}
            selectedStory={this.state.selectedStory}
            selectActiveStory={this.selectActiveStory}
            exportList={this.exportList}
          />
          { this.state.showAddList &&
            <AddListForm
              boards={this.state.board}
              onChange={this.updateBoardsState}
              onSubmit={this.trackList}
              errors={this.state.errors}
            />
          }
        </div>
        {Object.keys(this.state.selectedStory).length !== 0 &&
          <CheckListPanel checklists={this.state.selectedStory} />
        }
      </div>
    );
  }
}

ipcRenderer.on('selected-directory', (event, args) => {
  if (args.dir) {
    exportRawData(args.dir, args.data);
  }
});

ipcRenderer.on('return-token', (event, token) => {
  globalVar.callback(token);
});

export default Home;
