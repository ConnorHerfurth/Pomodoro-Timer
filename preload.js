const {contextBridge, ipcRenderer} = require('electron/renderer');

contextBridge.exposeInMainWorld('electronAPI', {
  playNotificationSound: (title) =>
    ipcRenderer.send('play-notification-sound', title),
});
