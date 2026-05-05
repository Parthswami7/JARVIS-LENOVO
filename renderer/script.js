const output = document.getElementById('output');
const statusEl = document.getElementById('status');
const inputEl = document.getElementById('commandInput');
const sendBtn = document.getElementById('sendBtn');

let busy = false;

function setOutput(text) {
  output.textContent = text;
}

async function runAssistant(input) {
  if (!input || busy) return;
  busy = true;
  statusEl.textContent = 'Processing...';
  try {
    const result = await window.jarvisAPI.runCommand(input);
    setOutput(JSON.stringify(result, null, 2));
    statusEl.textContent = 'Ready';
  } catch (err) {
    statusEl.textContent = 'Error';
    setOutput(err.message || String(err));
  } finally {
    busy = false;
  }
}

sendBtn.addEventListener('click', () => runAssistant(inputEl.value.trim()));
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') runAssistant(inputEl.value.trim());
});

window.jarvisAPI.onVoiceTranscript((transcript) => {
  inputEl.value = transcript;
  runAssistant(transcript);
});
