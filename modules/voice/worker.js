// Lightweight worker placeholder for Vosk stream integration.
// To keep startup fast, load Vosk only when wake-word mode is enabled.
let vosk;
let initialized = false;

async function init() {
  if (initialized) return;
  vosk = require('vosk');
  initialized = true;
}

process.on('message', async (msg) => {
  if (!msg) return;
  if (msg.type === 'init') await init();
});

setInterval(() => {
  // Replace with real wake-word + microphone stream pipeline.
}, 2000);
