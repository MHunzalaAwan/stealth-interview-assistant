# ✦ Stealth Interview Assistant - Real-Time Gemini 3.6 Flash HUD Overlay

A real-time AI interview assistant and Chrome Extension powered by **Gemini 3.6 Flash**. It listens to live interview speech streams during technical, system design, or behavioral interviews and displays instant, unobtrusive HUD talking points, STAR frameworks, metrics, confidence relevance scores, and code snippets directly over any web meeting tool.

---

## 🔑 Chrome Extension & API Key Architecture

### 🛡️ Does the Chrome Extension require a Gemini API Key?
**NO! The extension works with ZERO KEYS required by default.**

- **Zero-Key Server Proxy Mode (Default)**: When installed, the Chrome Extension routes transcript requests through your application server (`/api/interview/copilot`). The server holds the central `GEMINI_API_KEY` in its `.env` file, meaning **candidates do NOT need to obtain, manage, or pay for any API keys**.
- **Optional Standalone Key Mode**: If a candidate wants to use the Chrome Extension independently without running a backend server, they can optionally paste a free Google AI Studio key into the extension popup.

### 🎁 How to get a Free Gemini 3.6 Flash Key (for Standalone / Server setup)
1. Visit [Google AI Studio (aistudio.google.com/app/apikey)](https://aistudio.google.com/app/apikey).
2. Click **"Create API Key"**.
3. **100% Free Tier Limits**: Google AI Studio provides **15 Requests Per Minute (RPM)** and **1,000,000 Tokens Per Minute (TPM)** completely free of charge.
4. Add the key to your `.env` file (`GEMINI_API_KEY=...`) or paste it into the Chrome Extension popup options if running standalone.

---

## 🌟 Comprehensive Feature List

### 1. 🎯 Real-Time Gemini 3.6 Flash Copilot
- **Sub-Second Latency (< 1s)**: Processes speech transcripts continuously and outputs 10-second readable talking points, STAR frameworks, system design snippets, and interviewer pitfalls.
- **Context Relevance Confidence Score**: Evaluates AI response alignment against the interviewer's question with an animated percentage meter (`High Match 90%+`, `Good Match 75-89%`, `Moderate <75%`).
- **Text-to-Speech (TTS) Voice Practice**: Clickable speaker buttons allow candidates to hear generated talking points spoken aloud for vocal practice before real calls.

### 2. 🪟 Stealth Glassmorphic Transparent HUD Overlay
- **Draggable & Dockable**: Move the HUD window anywhere on your screen during video calls.
- **Adjustable Transparency (10% - 100%)**: Smooth opacity slider to make the overlay subtle and invisible to screen shares.
- **Click-Through Lock Mode**: Pass mouse click events through the overlay directly to your browser page or code editor.
- **One-Click Minimize**: Collapses into a small floating pill badge.

### 3. 🧩 Universal Chrome Extension (Manifest V3)
- **Universal Host Support (`<all_urls>`)**: Injects the transparent overlay into **Google Meet, Microsoft Teams, Zoom, Slack Huddles, Cisco Webex, LeetCode, HackerRank, Karat, and CoderPad**.
- **1-Click ZIP Package Exporter**: Bundled in-app JSZip engine allowing candidates to download `gemini-extension.zip` for instant unpacked installation via `chrome://extensions`.

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
- **Markdown Export (`.md`)**: Download your starred cheat-sheet notes as structured Markdown files for quick pre-interview review.

---

## 💻 Meeting Platform Compatibility

The Chrome Extension uses universal host matching (`<all_urls>`) so the overlay can be launched on **any browser tab**:

| Platform | Domain | Supported Features |
| :--- | :--- | :--- |
| **Google Meet** | `meet.google.com` | Live HUD, Speech Stream, STAR Answers, Confidence Score |
| **Microsoft Teams** | `teams.microsoft.com` | Live HUD, Speech Stream, STAR Answers, Confidence Score |
| **Zoom Web** | `*.zoom.us` | Live HUD, Speech Stream, STAR Answers, Confidence Score |
| **Slack Huddles** | `*.slack.com` | Live HUD, Speech Stream, STAR Answers, Confidence Score |
| **LeetCode / HackerRank** | `leetcode.com` / `hackerrank.com` | Live HUD, Coding Hints & Trade-offs |
| **Karat / CoderPad** | `karat.com` / `coderpad.io` | Live HUD, System Design & Algorithms |

---

## 🧩 Chrome Extension Installation Steps

1. **Download Extension Package**:
   - Open the app and navigate to the **Chrome Extension** tab.
   - Click **"Download Extension (.zip)"** to save `gemini-interview-copilot-extension.zip`.
2. **Unzip the Files**:
   - Extract the ZIP archive into a local folder on your computer.
3. **Load in Chrome**:
   - Open Google Chrome and go to `chrome://extensions`.
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
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Add your Gemini API key in `.env`:

```env
GEMINI_API_KEY=your_free_gemini_api_key_here
```

### 3. Install & Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will launch locally at `http://localhost:3000`.

---

## 📦 Production Deployment Steps

### Option 1: Docker / Cloud Run Container Deployment
1. Build production assets and CommonJS backend server:
   ```bash
   npm run build
   ```
2. Start the standalone production server:
   ```bash
   npm start
   ```
   The server binds to host `0.0.0.0` and port `3000`.

### Option 2: Deploying to Vercel / Render / Cloudflare
1. Connect your repository to your hosting provider.
2. Set Environment Variable: `GEMINI_API_KEY` = `your_free_api_key`.
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`

---

## 🔒 Security & GitHub Best Practices

- **Hidden API Keys**: All Gemini API calls route through server-side endpoints (`/api/interview/copilot`), ensuring your API key is never exposed to browser client bundles or public repositories.
- **`.gitignore` Protected**: Ensure `.env` is listed in `.gitignore` so secrets are never pushed to GitHub.
- **Local Privacy**: Candidate profiles, resume highlights, and saved notes remain in local storage (`chrome.storage.local` / browser memory) and are never uploaded or tracked.

---

## 📄 License
MIT License

---

## 💡 Recommended GitHub Repository Setup

- **Repo Name**: `stealth-interview-assistant`
- **Repo Description**: *"Real-time AI interview copilot & Chrome extension overlay powered by Gemini 3.6 Flash. Provides instant STAR answers, system design points, and code snippets during Google Meet, Zoom, and Teams calls."*
- **Topics/Tags**: `gemini-ai`, `interview-copilot`, `chrome-extension-manifest-v3`, `speech-to-text`, `google-meet`, `zoom`, `microsoft-teams`, `react`, `typescript`, `tailwindcss`
