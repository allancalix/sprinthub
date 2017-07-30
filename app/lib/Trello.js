'use strict';
const request = require('request');
const qs = require('query-string');
const db = require('./Db');


class Trello {
  constructor() {
  }

  sendRequest(details, params, next) {
    return new Promise(function(resolve, reject) {
      var data;
      request(`https://api.trello.com/${params}`,
        function(error, res, body) {
          if (res.statusCode !== 200) {
            reject(body);
            return;
          } else {
          data = JSON.parse(body);
          let promise = next(data, details);
          promise
            .then(success => {
              resolve(success)})
            .catch(() => {reject(promise)});
          }
        }
      );
    });
  }

  queryLists(boardId, name) {
    const params = {
      cards: 'none',
      fields: 'name',
      filter: 'open',
      key: this.key,
      token: this.token
    }

    const paramString = `1/boards/${boardId}/lists?${qs.stringify(params)}`
    const details = {
      boardId: boardId,
      name: name
    }

    let promise = this.sendRequest(details, paramString, db.saveSelectedList);

    return new Promise(function(resolve, reject) {
      promise
        .then(success => {resolve(success)})
        .catch(e => {reject(e)});
    });
  }

  // queryCards(listId, boardId, name) {
  //   const params = {
  //     cards: 'open',
  //     card_fields: 'name',
  //     key: this.key,
  //     fields: 'name,labels,url',
  //     token: this.token,
  //     checklists: 'all'
  //   }
  //   const paramString = `/1/lists/${listId}/cards/open?${qs.stringify(params)}`
  //   const details = {
  //     boardId: boardId,
  //     checkListId: listId,
  //     name: name
  //   }

  //   let promise = this.sendRequest(details, paramString, (data) => {console.log(data)});

  //   return new Promise(function(resolve, reject) {
  //     promise.then(data => {
  //       resolve(data);
  //     }).catch(e => {console.log(e)});
  //   });
  // }

  queryCards(listArray) {
    const batchUrl = listArray.map(listId => `/lists/${listId}/cards/open?fields=name%26fields=id%26fields=labels%26checklists=all%26`);
    const paramString = `/1/batch/?urls=${batchUrl}&key=${this.key}&token=${this.token}`
    let promise = this.sendRequest({}, paramString, data => {
      return new Promise((resolve, reject) => {
        resolve(data);
        });
    });

    return new Promise(function(resolve, reject) {
      promise.then(data => {
        resolve(data);
      }).catch(e => {console.log(e)});
    });
  }
}

module.exports = new Trello();