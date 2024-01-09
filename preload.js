const {contextBridge, ipcRenderer} = require('electron/renderer');

contextBridge.exposeInMainWorld('electronAPI', {
  playNotificationSound: () =>
    ipcRenderer.send('play-notification-sound'),
  startSessionTracking: () => 
    ipcRenderer.send('start-session-tracking'),
  endSessionTracking: () => 
    ipcRenderer.send('end-session-tracking'),
});