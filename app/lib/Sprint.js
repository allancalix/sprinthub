'use strict';
const Trello = require('./Trello');
const fs = require('fs');
const db = require('./Db');

class Sprint {
  trackNewList(boardId, name) {
    const promise = Trello.queryLists(boardId, name);
    return new Promise((resolve, reject) => {
      promise.then(message => {
        resolve(message);
      }).catch(e => reject(e));
    });
  }

  removeTrelloList(boardId, id) {
    const promise = db.removeTrelloList(boardId, id);
    return new Promise((resolve, reject) => {
      promise.then(message => {
        resolve(message);
      }).catch(e => reject(e));
    });
  }

  fetchCards(lists) {
    const promise = Trello.queryCards(lists);

    return new Promise((resolve, reject) => {
      promise.then(message => {
        resolve(message);
      }).catch(e => reject(e));
    });
  }

  // updateListData(boardId, name) {
  //   return new Promise((resolve, reject) => {
  //     db.fetchListId(name, boardId)
  //       .then((id) => {
  //         Trello.queryCards(id, this.boardId, this.name)
  //         .then((successMessage) => {
  //           resolve(successMessage);
  //         })
  //         .catch((err) => {
  //           reject(err);
  //         });
  //     }).catch(e => {console.log(e)});
  //   });
  // }

  returnTrackedBoards() {
    return new Promise((resolve, reject) => { 
      db.fetchBoards()
        .then((boards) => {
          resolve(boards);
        });
    });
  }

  // returnTrackedLists() {
  //   return new Promise((resolve, reject) => {
  //     db.fetchLists()
  //       .then(lists => {
  //         resolve(lists);
  //       });
  //   });
  // }

  // exportRawTitles() {
  //   return new Promise(function(resolve, reject) {
  //     db.fetchTrelloList('CaTOREX3', 'Test')
  //       .then((value) => {
  //         let cardTitles = [];
  //         value.cards.map((story) => {
  //           cardTitles.push(story.name);
  //         });
  //         resolve(cardTitles);
  //       })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   });
  // }

  // exportRawData(boardId) {
  //   db.fetchTrelloList(boardId, this.name)
  //     .then((value) => {
  //       let dataFile = fs.createWriteStream(`./raw_data/${this.name}.txt`);
  //       dataFile.write(`${this.name} Data\n`);
  //       value.cards.map((story) => {
  //         dataFile.write(`${story.name}\n`);
  //       });
  //       dataFile.write('\n----------------------------Stories---------------------------')
  //       value.cards.map((story) => {
  //         dataFile.write(`\n${story.name}\n`);
  //         story.checklists.map((checklist) => {
  //           dataFile.write(`\n${checklist.name}\n`);
  //           checklist.checkItems.map((item) => {
  //             dataFile.write(`${item.name}\n`);
  //           });
  //         });
  //       });
  //       console.log('Success!');
  //       dataFile.end();
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }
}

module.exports = new Sprint();