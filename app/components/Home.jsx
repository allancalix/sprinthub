// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ipcRenderer, shell } from 'electron';
import { Menu, Grid, Button, Loader } from 'semantic-ui-react';
import AddListForm from './AddListModal';
import BoardList from './BoardList';
import CheckListPanel from './CheckListPanel';
import { exportRawData, authenticateTrello } from '../lib/Sprint';
import styles from './css/Home.css';

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
    showAddList: false,
    showLoader: false
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
      this.setState({
        boards: nextProps.boards,
        showAddList: false,
        board: {
          boardId: '',
          listName: ''
        }
      });
    }
  }

  openExternalLink = url => {
    shell.openExternal(url);
  }

  login = (event: {preventDefault: () => void}) => {
    event.preventDefault();
    ipcRenderer.send('trello-login', authenticateTrello());
  }

  updateBoardsState = (event: { target: { name: string, value: string } }) => {
    const field = event.target.name;
    const boards = this.state.board;
    boards[field] = event.target.value;
    return this.setState({ board: boards });
  }

  selectActiveStory = (trelloId: string, cardId: string) => {
    this.props.lists[trelloId].map(checklist => {
      if (checklist.id === cardId) {
        return this.setState({ selectedStory: checklist });
      }
      return false;
    });
  }

  exportList = (trelloId: string) => {
    const list = this.props.lists[trelloId];
    ipcRenderer.send('open-dialog', list);
  }

  trackList = (event: {preventDefault: () => void}) => {
    event.preventDefault();
    this.props.addTrelloList(this.state.board.boardId, this.state.board.listName);
  }

  render() {
    return (
      <Grid divided="vertically">
        <Grid.Row columns={1}>
          <Grid.Column>
            <Menu fixed="top" size="large" style={{ backgroundColor: '#1976d2' }} fluid>
              <Menu.Item active>Sprint Hub</Menu.Item>
              <Menu.Menu position="right">
                <Menu.Item as={Link} to="/jira">Make Jira Board</Menu.Item>
                {!this.props.login &&
                  <Menu.Item className="item">
                    <Button secondary onClick={this.login}>Login</Button>
                  </Menu.Item>
                }
                <Menu.Item>
                  <AddListForm
                    boards={this.state.board}
                    onChange={this.updateBoardsState}
                    onSubmit={this.trackList}
                    errors={this.state.errors}
                    pendingResponse={this.props.lists.addListPending || false}
                  />
                </Menu.Item>
              </Menu.Menu>
            </Menu>
          </Grid.Column>
        </Grid.Row>
        <Loader inverted active={this.state.showLoader} />
        <Grid.Row columns={2} stretched>
          <Grid.Column floated="left" width={5} className={styles.sidebar} style={{ marginTop: '.7rem', marginRight: '0px' }}>
            <BoardList
              boards={this.props.boards}
              lists={this.props.lists}
              mapCards={this.props.mapCards}
              removeTrelloList={this.props.removeTrelloList}
              selectedStory={this.state.selectedStory}
              selectActiveStory={this.selectActiveStory}
              exportList={this.exportList}
            />
          </Grid.Column>
          <Grid.Column width={11}>
            {Object.keys(this.state.selectedStory).length !== 0 &&
              <CheckListPanel
                checklists={this.state.selectedStory}
                open={this.openExternalLink}
              />
            }
          </Grid.Column>
        </Grid.Row>
      </Grid>
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
