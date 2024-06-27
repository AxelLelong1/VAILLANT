const { app, BrowserWindow } = require('electron');
const path = require('path');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL(`file://${path.join(__dirname, 'build', 'index.html')}`);
}

app.whenReady().then(() => {
  // Start the Java backend server
  const backendProcess = exec('java -jar ../ping/target/ping-1.0.jar', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error starting backend: ${err}`);
      return;
    }
    console.log(`Backend output: ${stdout}`);
    console.error(`Backend error output: ${stderr}`);
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
    backendProcess.kill(); // Kill backend process on app close
  });
});
