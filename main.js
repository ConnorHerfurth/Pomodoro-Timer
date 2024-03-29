const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('node:path');
const sound = require('sound-play');
const fs = require('fs');

// TODO: Make it so that sessions can be stored and loaded to allow data
// to be perpetual.
// The format for sessions uses a key=startTime, and contains the following:
// - Number of focus sessions
// - Number of short breaks
// - Number of long breaks
// - End time
// Using this, we can calculate other pieces of information (such as how
// long the timer was paused, how productive the user was, etc.)
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
  loadSessionData();
  createwindow();
  getFocusTimerCount();
});

app.on('window-all-closed', () => {
  saveSessionData();
  app.quit();
});

function loadSessionData() {
  try {
    const fileData = fs.readFileSync('./sessionData.json').toString();
    sessionData = JSON.parse(fileData);
    console.log(`Loaded session data with ${Object.keys(sessionData).length} sessions.`);
  } catch {
    console.log("No existing session data, assuming empty.");
  }
}

function saveSessionData() {
  try {
    var sessionFile = fs.writeFileSync('./sessionData.json', JSON.stringify(sessionData));
  } catch (err) {
    console.log(`Failed to save session data with err: ${err}`);
  }
}

function getFocusTimerCount() {
  cumulative = 0;
  Object.keys(sessionData).forEach(function(session) {
    if('focusTimers' in sessionData[session]) {
      cumulative += sessionData[session]['focusTimers'];
    }
  })

  return cumulative;
}

function getBreakTimerCount() {
  cumulative = 0;
  Object.keys(sessionData).forEach(function(session) {
    if('breakTimers' in sessionData[session]) {
      cumulative += sessionData[session]['breakTimers'];
    }
  })

  return cumulative;
}

function getLongBreakTimerCount() {
  cumulative = 0;
  Object.keys(sessionData).forEach(function(session) {
    if('longBreakTimers' in sessionData[session]) {
      cumulative += sessionData[session]['longBreakTimers'];
    }
  })

  return cumulative;
}

ipcMain.on('play-notification-sound', (event) => {
  sound.play(path.join(__dirname, 'src', 'assets', 'DefaultAlarm.mp3'));
});

ipcMain.on('start-session-tracking', (event) => {
  currentTime = new Date();
  // Checking for edge behavior where a new session is started without
  // the previous one being ended.  Can technically happen if the frontend
  // calls the backend inappropriately.
  if(currentSession !== null) {
    sessionData[currentSession]['endTime'] = currentTime;
  }

  // Sets end time to null value so that, when session ends, the key
  // exists and the end time can be set.
  currentSession = new Date();
  sessionData[currentSession] = {'focusTimers': 0, 'breakTimers': 0, 'longBreakTimers': 0, 'endTime': null};
});

// Adds one to the number of focus timers in this current session.
ipcMain.on('add-session-focus-timer', (event) => {
  if(currentSession === null) {
    return;
  }

  if(!('focusTimers' in sessionData[currentSession])) {
    sessionData[currentSession]['focusTimers'] = 1;
  } else {
  sessionData[currentSession]['focusTimers'] = sessionData[currentSession]['focusTimers'] + 1;
  }
})

// Adds one to the number of breaks
ipcMain.on('add-session-break-timer', (event) => {
  if(currentSession === null) {
    return;
  }

  if(!('breakTimers' in sessionData[currentSession])) {
    sessionData[currentSession]['breakTimers'] = 1;
  } else {
    sessionData[currentSession]['breakTimers'] = sessionData[currentSession]['breakTimers'] + 1;
  }
});

// Adds one to the number of long breaks
ipcMain.on('add-session-long-break-timer', (event) => {
  if(currentSession === null) {
    return;
  }

  if(!('longBreakTimers' in sessionData[currentSession])) {
    sessionData[currentSession]['longBreakTimers'] = 1;
  } else {
    sessionData[currentSession]['longBreakTimers'] = sessionData[currentSession]['longBreakTimers'] + 1;
  }
});

ipcMain.handle('get-cumulative-session-data', (event) => {
  return {'focusTimers': getFocusTimerCount(),
          'breakTimers': getBreakTimerCount(),
          'longBreakTimers': getLongBreakTimerCount()};
});

ipcMain.handle('get-current-session-data', (event) => {
  if(currentSession == null) {
    return;
  }

  return {'focusTimers': sessionData[currentSession]['focusTimers'],
          'breakTimers': sessionData[currentSession]['breakTimers'],
          'longBreakTimres': sessionData[currentSession]['longBreakTimers']};
});