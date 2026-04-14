'use strict';

const { app, BrowserWindow, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

let backendProcess = null;
let mainWindow = null;

// ---------------------------------------------------------------------------
// Paths — app.getAppPath() resolves to the repo root in dev and to
// resources/app in a packaged build, so relative paths work in both cases.
// ---------------------------------------------------------------------------
function getBackendDir() {
  return path.join(app.getAppPath(), 'backend');
}

function getFrontendIndex() {
  return path.join(app.getAppPath(), 'frontend', 'dist', 'index.html');
}

// ---------------------------------------------------------------------------
// Start the Express backend
// ---------------------------------------------------------------------------
function startBackend() {
  const backendDir = getBackendDir();
  const serverScript = path.join(backendDir, 'server.js');

  backendProcess = spawn(process.execPath, [serverScript], {
    cwd: backendDir,
    env: { ...process.env },
    stdio: 'inherit',
  });

  backendProcess.on('error', (err) => {
    console.error('Backend process error:', err);
  });

  backendProcess.on('exit', (code) => {
    if (code !== null && code !== 0) {
      console.error(`Backend exited with code ${code}`);
    }
  });
}

// ---------------------------------------------------------------------------
// Poll the backend health endpoint until it responds
// ---------------------------------------------------------------------------
function waitForBackend(port, retries, delay) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const check = () => {
      http
        .get(`http://localhost:${port}/api/health`, (res) => {
          if (res.statusCode === 200) {
            resolve();
          } else {
            retry();
          }
        })
        .on('error', retry);
    };

    const retry = () => {
      attempts += 1;
      if (attempts >= retries) {
        reject(new Error('Backend did not start in time.'));
        return;
      }
      setTimeout(check, delay);
    };

    check();
  });
}

// ---------------------------------------------------------------------------
// Create the main window
// ---------------------------------------------------------------------------
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'Lyric Maze',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.loadFile(getFrontendIndex());

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ---------------------------------------------------------------------------
// App lifecycle
// ---------------------------------------------------------------------------
app.whenReady().then(async () => {
  startBackend();

  try {
    await waitForBackend(5000, 30, 500);
  } catch (err) {
    dialog.showErrorBox(
      'Startup Error',
      'The backend server failed to start.\n\n' +
        'Make sure you have run `npm install` inside the backend folder and ' +
        'that your .env file is configured correctly.'
    );
    app.quit();
    return;
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
