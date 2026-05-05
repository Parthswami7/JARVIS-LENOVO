const { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut } = require('electron');
const path = require('path');
const fs = require('fs');

const { executeCommand } = require('../modules/commands/engine');
const { buildReply } = require('../modules/ai/brain');
const { speak } = require('../modules/voice/tts');
const { startVoiceWorker, stopVoiceWorker } = require('../modules/voice/voiceWorkerManager');

let mainWindow;
let tray;

const isDev = !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 980,
    height: 620,
    minWidth: 860,
    minHeight: 560,
    backgroundColor: '#05070b',
    show: false,
    frame: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      backgroundThrottling: false,
      spellcheck: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  const iconPath = path.join(__dirname, '../assets/tray.png');
  if (!fs.existsSync(iconPath)) return;

  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show JarvisLite', click: () => mainWindow?.show() },
    { label: 'Hide', click: () => mainWindow?.hide() },
    {
      label: 'Quit',
      click: async () => {
        await stopVoiceWorker();
        app.quit();
      }
    }
  ]);
  tray.setToolTip('JarvisLite');
  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => mainWindow?.show());
}

function registerShortcuts() {
  globalShortcut.register('CommandOrControl+Shift+J', () => {
    if (mainWindow?.isVisible()) mainWindow.hide();
    else mainWindow?.show();
  });
}

app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-http-cache');

app.whenReady().then(async () => {
  createWindow();
  createTray();
  registerShortcuts();
  await startVoiceWorker();
});

app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    await stopVoiceWorker();
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('will-quit', async () => {
  globalShortcut.unregisterAll();
  await stopVoiceWorker();
});

ipcMain.handle('assistant:command', async (_, input) => {
  const cmdResult = await executeCommand(input);
  if (cmdResult.handled) {
    if (cmdResult.speech) await speak(cmdResult.speech);
    return cmdResult;
  }

  const aiReply = await buildReply(input);
  await speak(aiReply.text);
  return aiReply;
});

ipcMain.handle('assistant:speak', async (_, text) => {
  await speak(text);
  return { ok: true };
});

ipcMain.on('voice:detected', async (_, transcript) => {
  if (!mainWindow || !transcript) return;
  mainWindow.webContents.send('voice:transcript', transcript);
});
