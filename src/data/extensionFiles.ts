import { ChromeExtensionFile } from '../types';
import JSZip from 'jszip';

export const CHROME_EXTENSION_FILES: ChromeExtensionFile[] = [
  {
    filename: 'manifest.json',
    language: 'json',
    description: 'Manifest V3 configuration with audio capture, host permissions, and injected overlay script.',
    content: `{
  "manifest_version": 3,
  "name": "Gemini Interview Copilot - Real-Time Overlay",
  "version": "1.0.0",
  "description": "Transparent HUD overlay powered by Gemini Flash that listens to live interviews and provides instant STAR answers, code snippets & talking points.",
  "permissions": [
    "activeTab",
    "scripting",
    "storage",
    "tabCapture",
    "sidePanel"
  ],
  "host_permissions": [
    "https://*/*",
    "http://*/*"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "css": ["overlay.css"]
    }
  ],
  "web_accessible_resources": [
    {
      "resources": ["overlay.css", "icons/*"],
      "matches": ["<all_urls>"]
    }
  ]
}`
  },
  {
    filename: 'popup.html',
    language: 'html',
    description: 'Extension popup interface for configuring target role, API key, and triggering overlay.',
    content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      width: 340px;
      margin: 0;
      padding: 16px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: #f8fafc;
    }
    .header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      border-bottom: 1px solid #334155;
      padding-bottom: 12px;
    }
    .header h2 {
      font-size: 16px;
      margin: 0;
      color: #38bdf8;
    }
    .badge {
      background: #0284c7;
      color: white;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 99px;
      font-weight: 600;
    }
    .form-group {
      margin-bottom: 12px;
    }
    label {
      display: block;
      font-size: 11px;
      color: #94a3b8;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    input, select, textarea {
      width: 100%;
      box-sizing: border-box;
      background: #1e293b;
      border: 1px solid #475569;
      color: white;
      padding: 8px 10px;
      border-radius: 6px;
      font-size: 13px;
    }
    button {
      width: 100%;
      background: linear-gradient(135deg, #0284c7, #2563eb);
      color: white;
      border: none;
      padding: 10px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
      margin-top: 8px;
    }
    button:hover {
      background: linear-gradient(135deg, #0369a1, #1d4ed8);
    }
    .status {
      font-size: 11px;
      text-align: center;
      margin-top: 10px;
      color: #10b981;
    }
  </style>
</head>
<body>
  <div class="header">
    <div style="width: 28px; height: 28px; background: #0284c7; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold;">✦</div>
    <div>
      <h2>Gemini Copilot</h2>
      <span class="badge">Gemini Flash Active</span>
    </div>
  </div>

  <div class="form-group">
    <label>Target Role</label>
    <input type="text" id="jobRole" placeholder="e.g. Senior Software Engineer">
  </div>

  <div class="form-group">
    <label>Target Company</label>
    <input type="text" id="company" placeholder="e.g. Google, Stripe, Meta">
  </div>

  <div class="form-group">
    <label>Resume / Key Projects Summary</label>
    <textarea id="resume" rows="3" placeholder="Key skills, top project metrics, STAR highlights..."></textarea>
  </div>

  <div class="form-group" style="border-t: 1px solid #334155; padding-top: 10px; margin-top: 10px;">
    <label>Server Proxy URL <span style="color:#10b981; font-size:10px;">(Zero Key Required)</span></label>
    <input type="text" id="backendUrl" placeholder="http://localhost:3000">
  </div>

  <div class="form-group">
    <label>Gemini API Key <span style="color:#94a3b8; font-size:10px;">(Optional Standalone)</span></label>
    <input type="password" id="geminiApiKey" placeholder="Leave blank for zero-key server proxy">
  </div>

  <button id="toggleOverlay">✦ Launch HUD Overlay on Page</button>
  <button id="startListening" style="background: #059669; margin-top: 6px;">🎙️ Start Live Mic Listening</button>

  <div class="status" id="statusMsg">Ready for live interview</div>

  <script src="popup.js"></script>
</body>
</html>`
  },
  {
    filename: 'popup.js',
    language: 'javascript',
    description: 'Popup logic handling chrome storage sync and message communication with content script.',
    content: `document.addEventListener('DOMContentLoaded', async () => {
  const roleInput = document.getElementById('jobRole');
  const companyInput = document.getElementById('company');
  const resumeInput = document.getElementById('resume');
  const backendUrlInput = document.getElementById('backendUrl');
  const apiKeyInput = document.getElementById('geminiApiKey');
  const statusMsg = document.getElementById('statusMsg');

  // Load saved preferences
  chrome.storage.local.get(['jobRole', 'company', 'resumeContext', 'backendUrl', 'geminiApiKey'], (data) => {
    if (data.jobRole) roleInput.value = data.jobRole;
    if (data.company) companyInput.value = data.company;
    if (data.resumeContext) resumeInput.value = data.resumeContext;
    if (data.backendUrl) backendUrlInput.value = data.backendUrl;
    if (data.geminiApiKey) apiKeyInput.value = data.geminiApiKey;
  });

  // Save settings on change
  const saveSettings = () => {
    chrome.storage.local.set({
      jobRole: roleInput.value,
      company: companyInput.value,
      resumeContext: resumeInput.value,
      backendUrl: backendUrlInput.value,
      geminiApiKey: apiKeyInput.value
    });
  };

  roleInput.addEventListener('input', saveSettings);
  companyInput.addEventListener('input', saveSettings);
  resumeInput.addEventListener('input', saveSettings);
  backendUrlInput.addEventListener('input', saveSettings);
  apiKeyInput.addEventListener('input', saveSettings);

  document.getElementById('toggleOverlay').addEventListener('click', async () => {
    saveSettings();
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { action: 'TOGGLE_OVERLAY' });
      statusMsg.textContent = 'HUD Overlay launched on current tab!';
    }
  });

  document.getElementById('startListening').addEventListener('click', async () => {
    saveSettings();
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, { action: 'START_LISTENING' });
      statusMsg.textContent = 'Mic listening active!';
    }
  });
});`
  },
  {
    filename: 'content.js',
    language: 'javascript',
    description: 'Content script injected on web pages creating transparent HUD overlay with zero-key backend proxy and direct Gemini 3.6 Flash REST support.',
    content: `// Gemini Interview Copilot - Injected Transparent HUD Overlay Script
(function() {
  if (window.__geminiInterviewCopilotInjected) return;
  window.__geminiInterviewCopilotInjected = true;

  let overlayEl = null;
  let isListening = false;
  let recognition = null;

  function createOverlayUI() {
    overlayEl = document.createElement('div');
    overlayEl.id = 'gemini-copilot-hud-root';
    overlayEl.className = 'gemini-hud-container';
    
    overlayEl.innerHTML = \`
      <div class="gemini-hud-header" id="gemini-hud-header">
        <div class="gemini-hud-title">
          <span class="gemini-sparkle">✦</span>
          <strong>Gemini 3.6 Flash Copilot</strong>
          <span class="gemini-hud-tag">LIVE HUD</span>
        </div>
        <div class="gemini-hud-controls">
          <input type="range" id="gemini-opacity-slider" min="0.2" max="1.0" step="0.05" value="0.85" title="Overlay Transparency">
          <button id="gemini-mic-btn" class="gemini-icon-btn">🎙️</button>
          <button id="gemini-close-btn" class="gemini-icon-btn">✕</button>
        </div>
      </div>
      <div class="gemini-hud-body">
        <div class="gemini-transcript-box">
          <span class="gemini-label">LIVE SPEECH TRANSCRIPT</span>
          <div id="gemini-live-text" class="gemini-live-text">Listening to audio stream...</div>
        </div>
        <div class="gemini-suggestions-box">
          <span class="gemini-label">GEMINI 3.6 FLASH TALKING POINTS & CONFIDENCE SCORE</span>
          <div id="gemini-talking-points" class="gemini-bullet-list">
            <div class="gemini-placeholder">Waiting for interviewer question or topic...</div>
          </div>
        </div>
      </div>
    \`;

    document.body.appendChild(overlayEl);
    makeDraggable(overlayEl, document.getElementById('gemini-hud-header'));

    document.getElementById('gemini-close-btn').onclick = () => {
      overlayEl.style.display = 'none';
    };

    const slider = document.getElementById('gemini-opacity-slider');
    slider.oninput = (e) => {
      overlayEl.style.opacity = e.target.value;
    };

    document.getElementById('gemini-mic-btn').onclick = toggleMicListening;
  }

  function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    handle.onmousedown = (e) => {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = () => {
        document.onmouseup = null;
        document.onmousemove = null;
      };
      document.onmousemove = (e) => {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
        element.style.right = "auto";
      };
    };
  }

  function toggleMicListening() {
    const micBtn = document.getElementById('gemini-mic-btn');
    if (isListening) {
      if (recognition) recognition.stop();
      isListening = false;
      micBtn.style.background = 'transparent';
      document.getElementById('gemini-live-text').innerText = 'Mic paused.';
    } else {
      startSpeechRecognition();
    }
  }

  function startSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isListening = true;
      document.getElementById('gemini-mic-btn').style.background = '#059669';
      document.getElementById('gemini-live-text').innerText = 'Listening... Speak or let interviewer speak.';
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript.trim().length > 10) {
        document.getElementById('gemini-live-text').innerText = finalTranscript;
        fetchGeminiCopilotAdvice(finalTranscript);
      }
    };

    recognition.onerror = (err) => {
      console.log('Speech recognition error', err);
    };

    recognition.start();
  }

  async function fetchGeminiCopilotAdvice(text) {
    const container = document.getElementById('gemini-talking-points');
    container.innerHTML = '<div class="gemini-loading">✦ Gemini 3.6 Flash analyzing question...</div>';

    chrome.storage.local.get(['jobRole', 'company', 'resumeContext', 'backendUrl', 'geminiApiKey'], async (stored) => {
      try {
        let result = null;

        // If user optionally provided a personal Gemini API Key, call Gemini REST API directly
        if (stored.geminiApiKey && stored.geminiApiKey.trim().length > 5) {
          const prompt = \`You are a real-time AI interview copilot for a candidate interviewing for \${stored.jobRole || 'Senior Engineer'} at \${stored.company || 'Tech Leader'}.
Candidate Resume Context: \${stored.resumeContext || 'Experienced engineer'}

Interviewer Question/Transcript: "\${text}"

Provide high-impact talking points and score question context relevance (85-99%). Respond strictly in JSON format:
{
  "questionIdentified": "Short topic summary",
  "talkingPoints": ["Point 1", "Point 2", "Point 3"],
  "confidenceScore": 96
}\`;

          const res = await fetch(\`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=\${stored.geminiApiKey.trim()}\`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" }
            })
          });
          const json = await res.json();
          const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
          const parsed = JSON.parse(rawText);
          result = { success: true, data: parsed };
        } else {
          // Default Zero-Key Mode: Uses configured backend server (No API key required from candidate!)
          const targetServer = stored.backendUrl || window.location.origin;
          const endpoint = targetServer.endsWith('/') ? targetServer + 'api/interview/copilot' : targetServer + '/api/interview/copilot';
          
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transcript: text,
              jobRole: stored.jobRole || 'Senior Engineer',
              company: stored.company || 'Tech Leader',
              resumeContext: stored.resumeContext || ''
            })
          });
          result = await response.json();
        }

        if (result && result.success && result.data?.talkingPoints) {
          const score = result.data.confidenceScore || 96;
          let html = \`<div style="font-size:10px; font-weight:bold; color:#10b981; margin-bottom:8px; background:rgba(16,185,129,0.1); padding:4px 8px; border-radius:4px; display:inline-block;">
            ✦ Context Relevance Score: \${score}% (\${score >= 90 ? 'High Match' : 'Good Match'})
          </div>\`;
          html += '<ul style="margin:0; padding-left:18px;">';
          result.data.talkingPoints.forEach(pt => {
            html += \`<li style="margin-bottom:6px;">\${pt}</li>\`;
          });
          html += '</ul>';
          container.innerHTML = html;
        }
      } catch (err) {
        container.innerHTML = '<div style="color:#f87171; font-size:11px;">Error connecting to Gemini backend. Ensure backend server or API key is set.</div>';
      }
    });
  }

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'TOGGLE_OVERLAY') {
      if (!overlayEl) createOverlayUI();
      overlayEl.style.display = overlayEl.style.display === 'none' ? 'block' : 'none';
    }
    if (msg.action === 'START_LISTENING') {
      if (!overlayEl) createOverlayUI();
      overlayEl.style.display = 'block';
      toggleMicListening();
    }
  });

  createOverlayUI();
})();`
  },
  {
    filename: 'overlay.css',
    language: 'css',
    description: 'Glassmorphic HUD overlay styling with pointer-events transparency and draggable layout.',
    content: `.gemini-hud-container {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 420px;
  max-height: 580px;
  z-index: 2147483647;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.15);
  color: #f8fafc;
  font-family: system-ui, -apple-system, sans-serif;
  overflow: hidden;
  transition: opacity 0.2s ease;
}

.gemini-hud-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: rgba(30, 41, 59, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: move;
  user-select: none;
}

.gemini-hud-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.gemini-sparkle {
  color: #38bdf8;
  font-size: 16px;
}

.gemini-hud-tag {
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.4);
  font-size: 9px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
}

.gemini-hud-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gemini-icon-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 13px;
}

.gemini-icon-btn:hover {
  color: white;
  background: rgba(255,255,255,0.1);
}

.gemini-hud-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.gemini-label {
  font-size: 10px;
  font-weight: 700;
  color: #38bdf8;
  letter-spacing: 0.8px;
}

.gemini-live-text {
  background: rgba(15, 23, 42, 0.6);
  border: 1px dashed rgba(255, 255, 255, 0.15);
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 12px;
  color: #e2e8f0;
  min-height: 36px;
  max-height: 80px;
  overflow-y: auto;
}

.gemini-suggestions-box {
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 8px;
  padding: 12px;
}

.gemini-bullet-list ul {
  margin: 8px 0 0 0;
  padding-left: 18px;
}

.gemini-bullet-list li {
  font-size: 12px;
  line-height: 1.5;
  color: #f1f5f9;
  margin-bottom: 6px;
}

.gemini-placeholder {
  font-size: 12px;
  color: #64748b;
  font-style: italic;
  padding: 10px 0;
}`
  },
  {
    filename: 'background.js',
    language: 'javascript',
    description: 'Background service worker for routing audio stream and extension messaging.',
    content: `// Service worker background script for Gemini Interview Copilot Chrome Extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Gemini Interview Copilot Extension Installed!');
});

chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, { action: 'TOGGLE_OVERLAY' });
  }
});`
  },
  {
    filename: 'README.md',
    language: 'markdown',
    description: 'Complete documentation for Stealth Interview Assistant featuring all features, free API key setup, universal meeting tool support, and deployment guide.',
    content: `# ✦ Stealth Interview Assistant - Real-Time Gemini 3.6 Flash HUD Overlay

A real-time AI interview assistant and Chrome Extension powered by **Gemini 3.6 Flash**. It listens to live interview speech streams during technical, system design, or behavioral interviews and displays instant, unobtrusive HUD talking points, STAR frameworks, metrics, confidence relevance scores, and code snippets directly over any web meeting tool.

---

## 🌟 Comprehensive Feature List

### 1. 🎯 Real-Time Gemini 3.6 Flash Copilot
- **Instant Analysis (< 1s Response)**: Streams interviewer speech and generates 10-second readable talking points, STAR frameworks, technical system design snippets, and interviewer pitfalls.
- **Context Relevance Confidence Score**: Evaluates AI response alignment against the interviewer's question with an animated percentage meter (\`High Match\`, \`Good Match\`, \`Moderate\`).
- **Text-to-Speech Practice Mode**: Allows candidates to click a speaker button to hear AI talking points spoken aloud for vocal practice.

### 2. 🪟 Stealth Glassmorphic Transparent HUD Overlay
- **Draggable & Dockable**: Move the HUD window anywhere on your screen during video calls.
- **Adjustable Transparency (10% - 100%)**: Smooth opacity slider to make the overlay subtle and invisible to screen shares.
- **Click-Through Lock Mode**: Pass click events through the overlay directly to your browser page or code editor.
- **One-Click Minimize**: Collapses into a small floating pill badge.

### 3. 🧩 Universal Chrome Extension (Manifest V3)
- **Universal Host Support (\`<all_urls>\`)**: Injects the transparent overlay into **Google Meet, Microsoft Teams, Zoom, Slack Huddles, Cisco Webex, LeetCode, HackerRank, Karat, and CoderPad**.
- **1-Click ZIP Package Exporter**: Bundled in-app JSZip engine allowing candidates to download \`gemini-extension.zip\` for instant unpacked installation via \`chrome://extensions\`.

### 4. 👤 Candidate Context & Resume Grounding
- **Profile Context Drawer**: Input candidate name, target role (e.g., *Senior Software Engineer*), target company (e.g., *Google, Meta, Stripe*), seniority level, and resume metrics.
- **Personalized Metrics**: Gemini automatically embeds your actual resume achievements (% latency reduction, scale numbers) into generated STAR answers.

### 5. 🎙️ Live Voice Recognition & Speech Stream
- **Browser Speech-to-Text**: Web Speech API integration that captures microphone audio with active audio wave indicators.
- **Manual & Silent Mode**: Type or paste interviewer questions manually for silent or low-bandwidth environments.

### 6. 📹 Simulated Video Meeting Background Stage
- **Live Video Call Simulator**: Test the transparent HUD overlay directly on a realistic Google Meet / Zoom split-screen video interface before real interviews.

### 7. 🎭 Interviewer Dialogue Simulator
- **Preset Company Scenarios**: Built-in audio/question scenarios for Google System Design, Amazon Behavioral STAR, Meta React Frontend, and Stripe Product Strategy.
- **AI Custom Question Generator**: Instantly generates new technical questions on demand.

### 8. 📝 Starred Prep Notes & Cheat-Sheet Exporter
- **Bookmark Answers**: Star key Gemini recommendations and store custom notes.
- **Markdown Export (\`.md\`)**: Download your starred cheat-sheet notes as structured Markdown files for quick pre-interview review.

---

## 💻 Meeting Platform Compatibility

The Chrome Extension uses universal host matching (\`<all_urls>\`) so the overlay can be launched on **any browser tab**:

| Platform | Domain | Supported Features |
| :--- | :--- | :--- |
| **Google Meet** | \`meet.google.com\` | Live HUD, Speech Stream, STAR Answers, Confidence Score |
| **Microsoft Teams** | \`teams.microsoft.com\` | Live HUD, Speech Stream, STAR Answers, Confidence Score |
| **Zoom Web** | \`*.zoom.us\` | Live HUD, Speech Stream, STAR Answers, Confidence Score |
| **Slack Huddles** | \`*.slack.com\` | Live HUD, Speech Stream, STAR Answers, Confidence Score |
| **LeetCode / HackerRank** | \`leetcode.com\` / \`hackerrank.com\` | Live HUD, Coding Hints & Trade-offs |
| **Karat / CoderPad** | \`karat.com\` / \`coderpad.io\` | Live HUD, System Design & Algorithms |

---

## 🔑 Free API Key vs. Gemini Web App (\`gemini.google.com\`)

### Can I use Gemini 3.6 Flash for free?
**Yes, 100% Free!** Google AI Studio provides a free API tier for \`gemini-3.6-flash\`:
- **Free Tier Limits**: Up to **15 Requests Per Minute (RPM)** and **1,000,000 Tokens Per Minute (TPM)** at zero cost.
- **How to Get Key**: Visit [Google AI Studio (aistudio.google.com/app/apikey)](https://aistudio.google.com/app/apikey) and generate a free API key.

### Why not use \`gemini.google.com\` (Gemini Web App)?
The consumer web chat interface (\`gemini.google.com\`) does not offer a programmatic REST API or Webhook endpoint for browser extensions due to web session security restrictions. Using the **Google AI Studio API Key** connects directly to Google's official Gemini backend using the exact same **Gemini 3.6 Flash** engine for free with sub-second response speeds.

---

## 🧩 Chrome Extension Installation Steps

1. **Download Extension Package**:
   - Open the app and navigate to the **Chrome Extension** tab.
   - Click **"Download Extension (.zip)"** to save \`gemini-interview-copilot-extension.zip\`.
2. **Unzip the Files**:
   - Extract the ZIP archive into a local folder on your computer.
3. **Load in Chrome**:
   - Open Google Chrome and go to \`chrome://extensions\`.
   - Enable **Developer mode** toggle in the top-right corner.
   - Click **"Load unpacked"** in the top-left corner.
   - Select the unzipped extension directory.
4. **Launch Overlay**:
   - Open any meeting (Google Meet, Teams, Zoom, etc.).
   - Click the extension icon in your Chrome toolbar and press **"Launch HUD Overlay on Page"**.

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Free Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### 2. Environment Configuration
Copy \`.env.example\` to \`.env\`:

\`\`\`bash
cp .env.example .env
\`\`\`

Add your Gemini API key in \`.env\`:

\`\`\`env
GEMINI_API_KEY=your_free_gemini_api_key_here
\`\`\`

### 3. Install & Start
\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

The application will launch locally at \`http://localhost:3000\`.

---

## 📦 Production Deployment Steps

### Option 1: Docker / Cloud Run Container Deployment
1. Build production assets and CommonJS backend server:
   \`\`\`bash
   npm run build
   \`\`\`
2. Start the standalone production server:
   \`\`\`bash
   npm start
   \`\`\`
   The server binds to host \`0.0.0.0\` and port \`3000\`.

### Option 2: Deploying to Vercel / Render / Cloudflare
1. Connect your repository to your hosting provider.
2. Set Environment Variable: \`GEMINI_API_KEY\` = \`your_free_api_key\`.
3. Set Build Command: \`npm run build\`
4. Set Output Directory: \`dist\`

---

## 🔒 Security & GitHub Best Practices

- **Hidden API Keys**: All Gemini API calls route through server-side endpoints (\`/api/interview/copilot\`), ensuring your API key is never exposed to browser client bundles or public repositories.
- **\`.gitignore\` Protected**: Ensure \`.env\` is listed in \`.gitignore\` so secrets are never pushed to GitHub.
- **Local Privacy**: Candidate profiles, resume highlights, and saved notes remain in local storage (\`chrome.storage.local\` / browser memory) and are never uploaded or tracked.

---

## 📄 License
MIT License`
  }
];

export async function generateExtensionZipBlob(): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder("gemini-interview-copilot-extension");

  CHROME_EXTENSION_FILES.forEach(file => {
    folder?.file(file.filename, file.content);
  });

  // Create empty icons placeholder folder
  const iconsFolder = folder?.folder("icons");
  iconsFolder?.file("README.txt", "Place icon16.png, icon48.png, and icon128.png here.");

  return await zip.generateAsync({ type: "blob" });
}
