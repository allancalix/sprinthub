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

  removeTrelloList(boardId, id) {
    return new Promise((resolve, reject) => {
      db
      .get('boards')
      .find({boardId: boardId})
      .get('trelloLists')
      .remove({ trelloId: id })
      .write()
      .then(() =>{
        if(_.isEmpty(db.get('boards').find({boardId: boardId}).get('trelloLists').value())) {
          db
          .get('boards')
          .remove({boardId: boardId})
          .write()
          .then(() => resolve('removedEmptyBoard'));
        } else {
          return resolve('Success');
        }
      }).catch(() => reject('Problem deleting list'));
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