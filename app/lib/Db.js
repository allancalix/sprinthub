'use strict';
const low = require('lowdb');
const _ = require('lodash');
const db = low('./data/db.json', {storage: require('lowdb/lib/storages/file-async')});

class Db {
  saveSelectedList(trelloData, details) {
    if (!db.get('boards').some({boardId: details.boardId}).value()) {
      db
        .get('boards')
        .push({boardId: details.boardId, trelloLists: []})
        .write();
    }

    return new Promise(function(resolve, reject) {
      const list = _.find(trelloData, {name: details.name});
      if (list) {
        if (!db.get('boards').find({boardId: details.boardId}).get('trelloLists').some({name: details.name}).value()) {
          db
            .get('boards')
            .find({boardId: details.boardId})
            .get('trelloLists') 

            .push({name: list.name, trelloId: list.id})
            .write()
            .then(() => {resolve(list.id)});
        } else {
          reject('This list is already added');
        }
      } else {
        reject('List was not found on specified board');
      }
    });
  }

  removeTrelloList(boardId, id) {
    return new Promise((resolve, reject) => {
      db
      .get('boards')
      .find({boardId: boardId})
      .get('trelloLists')
      .remove({trelloId: id})
      .write()
      .then(() => resolve('Success'))
      .catch(() => reject('Problem deleting list'));
    });
  }

  fetchBoards() {
    return new Promise((resolve, reject) =>{
      let currentBoards = (db.get('boards').cloneDeep().value());
      resolve(currentBoards);
    });
  }

  // fetchLists() {
  //   return new Promise((resolve, reject) => {
  //     db
  //       .get('boards')
  //       .unset('boards.trelloLists')
  //       .write()
  //       .then(err => {
  //         resolve('Success');
  //       });
  //   }); 
  // }

  // fetchTrelloList(boardId, name) {
  //   return new Promise((resolve, reject) => {
  //     resolve(db
  //       .get('boards')
  //       .find({boardId: boardId})
  //       .get('trelloLists')
  //       .find({name: name})
  //       .value());
  //   });
  // }

  // fetchListId(name, boardId) {
  //   return new Promise(function(resolve, reject) {
  //     let id = db
  //       .get('boards')
  //       .find({boardId: boardId})
  //       .get('trelloLists')
  //       .find({name: name})
  //       .get('trelloId')
  //       .value();
  //     console.log(id);
  //     if(id) {
  //       resolve(id);
  //     } else {
  //      reject(id)
  //     }
  //   });
  // }
}

module.exports = new Db();