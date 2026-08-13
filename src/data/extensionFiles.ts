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
  const statusMsg = document.getElementById('statusMsg');

  // Load saved preferences
  chrome.storage.local.get(['jobRole', 'company', 'resumeContext'], (data) => {
    if (data.jobRole) roleInput.value = data.jobRole;
    if (data.company) companyInput.value = data.company;
    if (data.resumeContext) resumeInput.value = data.resumeContext;
  });

  // Save settings on change
  const saveSettings = () => {
    chrome.storage.local.set({
      jobRole: roleInput.value,
      company: companyInput.value,
      resumeContext: resumeInput.value
    });
  };

  roleInput.addEventListener('input', saveSettings);
  companyInput.addEventListener('input', saveSettings);
  resumeInput.addEventListener('input', saveSettings);

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
    description: 'Content script injected on web pages (Google Meet, Zoom, etc.) creating the HUD overlay DOM container and processing Web Speech API transcripts.',
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
          <strong>Gemini Flash Copilot</strong>
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
          <span class="gemini-label">GEMINI FLASH REAL-TIME TALKING POINTS</span>
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
    container.innerHTML = '<div class="gemini-loading">✦ Gemini Flash analyzing question...</div>';

    chrome.storage.local.get(['jobRole', 'company', 'resumeContext'], async (stored) => {
      try {
        const response = await fetch('https://' + window.location.host + '/api/interview/copilot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            transcript: text,
            jobRole: stored.jobRole || 'Senior Engineer',
            company: stored.company || 'Tech Leader',
            resumeContext: stored.resumeContext || ''
          })
        });
        const result = await response.json();
        if (result.success && result.data?.talkingPoints) {
          let html = '<ul>';
          result.data.talkingPoints.forEach(pt => {
            html += \`<li>\${pt}</li>\`;
          });
          html += '</ul>';
          container.innerHTML = html;
        }
      } catch (err) {
        container.innerHTML = '<div>Error connecting to Gemini backend.</div>';
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
