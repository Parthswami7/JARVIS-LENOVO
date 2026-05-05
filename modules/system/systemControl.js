const { exec } = require('child_process');

function runShell(cmd) {
  return new Promise((resolve) => {
    exec(cmd, { windowsHide: true }, (error) => {
      resolve(!error);
    });
  });
}

function parseSystemCommand(text) {
  const t = text.toLowerCase();

  if (t === 'shutdown') {
    runShell('shutdown /s /t 20');
    return { handled: true, speech: 'Shutdown scheduled in 20 seconds.', action: 'shutdown' };
  }

  if (t === 'restart') {
    runShell('shutdown /r /t 20');
    return { handled: true, speech: 'Restart scheduled in 20 seconds.', action: 'restart' };
  }

  if (t.includes('volume up')) {
    return { handled: true, speech: 'Volume up is reserved for native utility integration.', action: 'volume' };
  }

  if (t.includes('volume down')) {
    return { handled: true, speech: 'Volume down is reserved for native utility integration.', action: 'volume' };
  }

  return { handled: false };
}

module.exports = { parseSystemCommand };
