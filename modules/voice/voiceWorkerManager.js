const { fork } = require('child_process');
const path = require('path');

let worker = null;
let lastEventTs = 0;

async function startVoiceWorker() {
  if (worker) return;
  worker = fork(path.join(__dirname, 'worker.js'), [], { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });
  worker.on('message', (msg) => {
    if (!msg || msg.type !== 'transcript') return;
    const now = Date.now();
    if (now - lastEventTs < 1200) return;
    lastEventTs = now;
  });
}

async function stopVoiceWorker() {
  if (!worker) return;
  worker.kill();
  worker = null;
}

module.exports = { startVoiceWorker, stopVoiceWorker };
