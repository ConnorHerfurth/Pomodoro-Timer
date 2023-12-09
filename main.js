const {app, BrowserWindow} = require('electron');

const createwindow = () => {
  const win = new BrowserWindow({
    width: 400,
    height: 1000,
  });

  win.loadFile('index.html');
};

app.whenReady().then(() => {
  createwindow();
});

app.on('window-all-closed', () => {
  app.quit();
});
