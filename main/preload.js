const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('jarvisAPI', {
  runCommand: (input) => ipcRenderer.invoke('assistant:command', input),
  speak: (text) => ipcRenderer.invoke('assistant:speak', text),
  onVoiceTranscript: (handler) => {
    ipcRenderer.on('voice:transcript', (_, transcript) => handler(transcript));
  }
});
