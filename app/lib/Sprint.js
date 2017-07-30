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

  returnTrackedBoards() {
    return new Promise((resolve, reject) => { 
      db.fetchBoards()
        .then((boards) => {
          resolve(boards);
        });
    });
  }

  exportRawData(dir, data) {
    let dataFile = fs.createWriteStream(`${dir}/trello_data.txt`);
    dataFile.write(`Trello Data\n`);
    data.map(story => {
      dataFile.write(`${story.name}\n`);
    });
    dataFile.write('\n----------------------------Stories---------------------------')
    data.map(story => {
      dataFile.write(`\n${story.name}\n`);
      story.checklists.map((checklist) => {
        dataFile.write(`\n${checklist.name}\n`);
        checklist.checkItems.map((item) => {
          dataFile.write(`${item.name}\n`);
        });
      });
    });
    dataFile.end();
  }
}

module.exports = new Sprint();