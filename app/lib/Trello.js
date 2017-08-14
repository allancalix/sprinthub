const request = require('request');
const qs = require('query-string');
const db = require('./Db');

class Trello {
  constructor(token) {
    this.key = '4277ea22952d77494356172dd27fa7d0';
    this.token = token;
  }

  login() {
    const params = {
      scope: 'read,write',
      expiration: 'never',
      name: 'SprintHub',
      key: this.key,
      return_url: 'https://localhost/app.html'
    };

    const paramString = `/1/authorize?${qs.stringify(params)}`;
    return `https://trello.com/${paramString}`;
  }

  sendRequest(details, params, next) {
    return new Promise((resolve, reject) => {
      let data;
      request(`https://api.trello.com/${params}`,
        (error, res, body) => {
          if (res.statusCode !== 200) {
            return reject(body);
          }
          data = JSON.parse(body);
          const promise = next(data, details);
          promise
            .then(success =>
              resolve(success)
            ).catch(() => { reject(promise); });
        }
      );
    });
  }

  queryLists(board, name) {
    const params = {
      cards: 'none',
      fields: 'name',
      filter: 'open',
      key: this.key,
      token: this.token
    };

    const paramString = `1/boards/${board.id}/lists?${qs.stringify(params)}`;
    const details = {
      boardId: board.id,
      boardName: board.boardName,
      name
    };

    const promise = this.sendRequest(details, paramString, db.saveSelectedList);

    return new Promise((resolve, reject) => {
      promise
        .then(success => resolve(success))
        .catch(e => reject(e));
    });
  }

  queryCards(listArray) {
    const batchUrl = listArray.map(listId => `/lists/${listId}/cards/open?fields=name%26fields=id%26fields=labels%26checklists=all%26attachments=true%26attachment_fields=url%26attachment_fields=previews%26attachment_fields=name`);
    const paramString = `/1/batch/?urls=${batchUrl}&key=${this.key}&token=${this.token}`;
    const promise = this.sendRequest({}, paramString, data =>
      new Promise((resolve) => resolve(data))
    );

    return new Promise((resolve, reject) => {
      promise
      .then(data =>
        resolve(data))
      .catch(e => reject(e));
    });
  }

  mapBoardName(id, cb) {
    const params = {
      fields: 'name, id, shorturl',
      key: this.key,
      token: this.token
    };

    const paramString = `/1/boards/${id}?${qs.stringify(params)}`;

    this.sendRequest(null, paramString, cb);
  }
}

module.exports = Trello;
