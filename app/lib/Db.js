const low = require('lowdb');
const os = require('os');
const _ = require('lodash');
const db = low(os.homedir() + '/db.json', {storage: require('lowdb/lib/storages/file-async')});

class Db {
  init() {
    if (db.get('user').value() === undefined) {
      db
      .defaults({ user: { trelloToken: '' }, boards: [] })
      .write();
    }
  }

  hasBoard(id) {
    return db.get('boards').some({ boardId: id }).value();
  }

  saveSelectedList(trelloData, details) {
    return new Promise(function(resolve, reject) {
      const list = _.find(trelloData, {name: details.name});
      if (list) {
        if (!db.get('boards').some({ boardId: details.boardId }).value()) {
          db
            .get('boards')
            .push({boardId: details.boardId, boardName: details.boardName, trelloLists: []})
            .write()
            .then(() => {details.newBoard = true});
        }
        if (!db.get('boards').find({boardId: details.boardId}).get('trelloLists').some({name: details.name}).value()) {
          db
            .get('boards')
            .find({boardId: details.boardId})
            .get('trelloLists')
            .push({name: list.name, trelloId: list.id})
            .write()
            .then(() => {resolve({id: list.id, newBoard: details.newBoard})});
        } else {
          reject({ fields: ['listName'], message: 'This list is already added' });
        }
      } else {
        reject({ fields: ['listName'], message: 'List was not found on specified board' });
      }
    });
  }

  /*
   *
   * Method used to remove a list from the database file.
   * @boardId: id of board to remove, @id: id of list to remove
   * Notes: Could be done using only list id since they are unique everywhere.
   *
   */
  async removeTrelloList(boardId, id) {
    const result = {};
    try {
      await db.get('boards').find({boardId: boardId}).get('trelloLists').remove({ trelloId: id }).write();
      // If this list is the last in a board, remove the board
      if(_.isEmpty(db.get('boards').find({boardId: boardId}).get('trelloLists').value())) {
        await db.get('boards').remove({boardId: boardId}).write()
        // Maybe a dumb way to signal that boards should be updated
        result.message = 'removedEmptyBoard';
      }
      result.success = 0;
    } catch (err) {
      error = -1;
    }
    return new Promise((resolve, reject) => {
      if (result.success < 0) {
        reject(result.message);
      }
      resolve(result.message);
    });
  }

  fetchBoards() {
    return new Promise((resolve, reject) =>{
      let currentBoards = (db.get('boards').cloneDeep().value());
      resolve(currentBoards);
    });
  }

  setTrelloToken(token) {
    return new Promise((resolve, reject) => {
      db
      .get('user')
      .set('trelloToken', token)
      .write()
      .then(() => resolve('Succes'))
      .catch(err => reject(err));
    });
  }

  isTrelloTokenSet() {
    return db.get('user').get('trelloToken').value() ? true : false;
  }

  returnTrelloToken() {
    return db.get('user').get('trelloToken').value();
  }
}

module.exports = new Db();

