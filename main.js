const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('node:path');
const sound = require('sound-play');

// TODO: Make it so that sessions can be stored and loaded to allow data
// to be perpetual.
// Current format is key=startTime and value=endTime for any session.
let sessionData = {};
let currentSession = null;

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

ipcMain.on('play-notification-sound', (event) => {
  sound.play(path.join(__dirname, 'src', 'assets', 'DefaultAlarm.mp3'));
});

ipcMain.on('start-session-tracking', (event) => {
  // Checking for edge behavior where a new session is started without
  // the previous one being ended.
  if(currentSession !== null) {
    sessionData[currentSession] = new Date();
  }

  // Sets end time to null value so that, when session ends, the key
  // exists and the end time can be set.
  currentSession = new Date();
  sessionData[currentSession] = null;
});

ipcMain.on('end-session-tracking', (event) => {
  if(currentSession === null) {
    return;
  }

  sessionData[currentSession] = new Date();

  console.log(sessionData);
});