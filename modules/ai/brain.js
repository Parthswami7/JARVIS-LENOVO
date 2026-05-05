const path = require('path');

let gpt4all;
let model;

async function lazyLoadModel() {
  if (model) return model;
  if (!gpt4all) ({ GPT4All: gpt4all } = require('gpt4all'));

  model = new gpt4all('ggml-tinyllama-q4_0.bin', {
    modelPath: path.join(process.cwd(), 'models'),
    allowDownload: false,
    verbose: false
  });

  await model.init();
  return model;
}

function ruleBasedReply(input) {
  const q = input.toLowerCase();
  if (q.includes('hello') || q.includes('hi')) return 'Hello. Systems are online and ready.';
  if (q.includes('time')) return `UTC time is ${new Date().toISOString()}.`;
  if (q.includes('status')) return 'All core modules are active in offline mode.';
  return null;
}

async function buildReply(input) {
  const fast = ruleBasedReply(input);
  if (fast) return { handled: true, text: fast, source: 'rules' };

  try {
    const ai = await lazyLoadModel();
    const text = await ai.prompt(`You are JarvisLite. Reply briefly. User: ${input}`);
    return { handled: true, text, source: 'tinyllama' };
  } catch {
    return {
      handled: true,
      text: 'AI model is unavailable offline. Please add a TinyLlama/GPT4All model in /models.',
      source: 'fallback'
    };
  }
}

module.exports = { buildReply };
