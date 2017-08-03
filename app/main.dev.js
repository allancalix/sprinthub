/* eslint global-require: 1, flowtype-errors/show-errors: 0 */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import Db from './lib/Db';
import MenuBuilder from './menu';

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log);
};


/**
 * Add event listeners...
 */
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  Db.init();

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  ipcMain.on('open-dialog', (event, args) => {
    dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] }, location => {
      const directory = (location) ? location[0] : false;
      event.sender.send('selected-directory', { dir: directory, data: args });
    });
  });

  ipcMain.on('trello-login', (event, args) => {
    let trelloWindow = new BrowserWindow({
      show: false,
      width: 1000,
      height: 800,
      nodeIntegration: false,
      webPreferences: {
        webSecurity: false,
        contextIsolation: true
      }
    });

    trelloWindow.loadURL(args);

    const returnToken = token => {
      event.sender.send('return-token', token);
      trelloWindow.destroy();
    }

    trelloWindow.webContents.on('will-navigate', (event, url) => {
      let checkUrl = url.split('#');
      if (checkUrl[0] === 'https://localhost/app.html') {
        returnToken(checkUrl[1].split('=')[1]);
      } else {
        trelloWindow.loadURL(url);
      }
    });

    trelloWindow.webContents.on('did-finish-load', () => {
      if (!trelloWindow) {
        throw new Error('"trelloWindow" is not defined');
      }
      trelloWindow.show();
      trelloWindow.focus();
    });

    trelloWindow.on('closed', () => {
      trelloWindow = null;
    });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
});
