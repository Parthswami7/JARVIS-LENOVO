const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { parseSystemCommand } = require('../system/systemControl');

const customPath = path.join(__dirname, '../data/customCommands.json');

function loadCustomCommands() {
  try {
    return JSON.parse(fs.readFileSync(customPath, 'utf8'));
  } catch {
    return {};
  }
}

function launchApp(command) {
  const map = {
    chrome: 'start chrome',
    vscode: 'start code',
    notepad: 'start notepad'
  };

  const key = command.toLowerCase();
  if (!map[key]) return false;

  spawn(map[key], { shell: true, detached: true, stdio: 'ignore' }).unref();
  return true;
}

async function executeCommand(input) {
  const text = String(input || '').trim();
  if (!text) return { handled: true, speech: 'Please say or type a command.' };

  const sys = parseSystemCommand(text);
  if (sys.handled) return sys;

  if (text.toLowerCase().startsWith('open ')) {
    const app = text.slice(5).trim();
    const ok = launchApp(app);
    return ok
      ? { handled: true, speech: `Opening ${app}.`, action: 'open-app' }
      : { handled: true, speech: `I cannot open ${app} yet.`, action: 'open-app' };
  }

  const customCommands = loadCustomCommands();
  const custom = customCommands[text.toLowerCase()];
  if (custom) {
    spawn(custom, { shell: true, detached: true, stdio: 'ignore' }).unref();
    return { handled: true, speech: `Executing ${text}.`, action: 'custom-command' };
  }

  return { handled: false };
}

module.exports = { executeCommand };
