'use strict';

const app = require('app');
const BrowserWindow = require('browser-window');

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

function createMainWindow () {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
    });

    win.maximize()
    win.loadUrl(`file://${__dirname}/../templates/index.html`);
    win.on('closed', onClosed);

    /*
    // Open links on external navigator
    win.webContents.on('will-navigate', (e, url) => {
        require('shell').openExternal(url);
        e.preventDefault();
    });
    */

    return win;
}

function onClosed() {
    // deref the window
    // for multiple windows store them in an array
    mainWindow = null;
}

// prevent window being GC'd
let mainWindow;

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate-with-no-open-windows', () => {
    if (!mainWindow) {
        mainWindow = createMainWindow();
    }
});

app.on('ready', () => {
    //var protocol = require('protocol');

    mainWindow = createMainWindow();

    /*
    protocol.interceptProtocol('file', request => {
        var match = request.url.substr(7, 1);

        if (match != '/') {
            var url = request.url.substr(7);
            console.log(`${url}`)
            return new protocol.RequestHttpJob({ url: 'https://' + url });
        }
    }, (err, scheme) => {
        if (!error) console.log(`${scheme} intercepted successfully`)
    });
    */
});
