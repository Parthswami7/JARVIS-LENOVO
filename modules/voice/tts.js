const { spawn } = require('child_process');
const path = require('path');

let active = null;

function speak(text) {
  return new Promise((resolve) => {
    if (!text) return resolve();

    if (active) {
      active.kill();
      active = null;
    }

    const script = path.join(__dirname, '../../python/tts.py');
    active = spawn('python', [script, text], { windowsHide: true });

    active.on('exit', () => {
      active = null;
      resolve();
    });

    active.on('error', () => resolve());
  });
}

module.exports = { speak };
