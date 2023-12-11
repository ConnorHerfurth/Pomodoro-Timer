const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('node:path');
const sound = require('sound-play');

const createwindow = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadFile('./src/index.html');
};

app.whenReady().then(() => {
  createwindow();
});

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('play-notification-sound', (event, title) => {
  sound.play(path.join(__dirname, 'src', 'assets', 'DefaultAlarm.mp3'));
});
