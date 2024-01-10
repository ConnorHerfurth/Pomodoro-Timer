const {contextBridge, ipcRenderer} = require('electron/renderer');

contextBridge.exposeInMainWorld('electronAPI', {
  playNotificationSound: () =>
    ipcRenderer.send('play-notification-sound'),
  startSessionTracking: () => 
    ipcRenderer.send('start-session-tracking'),
  addSessionFocusTimer: () =>
    ipcRenderer.send('add-session-focus-timer'),
  addSessionBreakTimer: () =>
    ipcRenderer.send('add-session-break-timer'),
  addSessionLongBreakTimer: () =>
    ipcRenderer.send('add-session-long-break-timer'),
  endSessionTracking: () => 
    ipcRenderer.send('end-session-tracking'),
});