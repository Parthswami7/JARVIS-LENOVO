# JarvisLite (Offline Electron Assistant)

## 1) Architecture Overview

- `main/`: Electron main process (window lifecycle, IPC, tray, shortcuts).
- `renderer/`: Lightweight HUD UI (HTML/CSS/Vanilla JS only).
- `modules/commands`: Command parsing + app launch + custom JSON commands.
- `modules/voice`: TTS + separate voice worker (Vosk-ready).
- `modules/ai`: Offline AI brain (rule-based first, TinyLlama/GPT4All lazy fallback).
- `python/`: Optional bridge for TTS (pyttsx3) and future Vosk scripts.

## 2) Setup Instructions

### Prerequisites

- Node.js 20+
- Python 3.10+
- Windows 64-bit

### Install

```bash
npm install
pip install -r python/requirements.txt
```

### Offline model setup (optional AI)

1. Create `models/` in project root.
2. Add quantized model file, e.g. `ggml-tinyllama-q4_0.bin` (recommended <1GB).
3. Keep model unloaded until first AI query.

## 3) Run

```bash
npm run start
```

## 4) Build `.exe`

```bash
npm run build
```

Output installer will be in `dist/`.

## 5) Performance Strategy

- Renderer sandboxed (`sandbox: true`, `contextIsolation: true`, `nodeIntegration: false`).
- Minimal DOM + CSS-only wave animation.
- Rule-based fast path before AI load.
- AI model lazy-load only on unmatched prompts.
- Voice worker runs in separate process; debounced transcript events.
- Python TTS process spawned per response and exits immediately.

## 6) Bonus Features Included

- Global shortcut: `Ctrl+Shift+J` to show/hide window.
- System tray support (add `assets/tray.png` to enable icon).
- Floating-like quick toggle behavior via shortcut + tray.

## 7) Low-End Hardware Notes

- Keep only one BrowserWindow.
- Avoid extra renderer tabs/webviews.
- Prefer rule commands for common tasks.
- Use quantized tiny models only.
- Disable AI usage entirely for maximum responsiveness.
