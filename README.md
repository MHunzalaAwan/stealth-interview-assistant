# ✦ Gemini Interview Copilot - Real-Time AI HUD Overlay

A real-time AI interview assistant and Chrome Extension powered by **Gemini 3.6 Flash**. It listens to live interview speech streams during technical, system design, or behavioral interviews and displays instant, unobtrusive HUD talking points, STAR frameworks, metrics, and code snippets directly over any web meeting tool.

---

## 🌟 Key Features

- **Universal Meeting Tool Support**: Works seamlessly on Google Meet, Microsoft Teams, Zoom, Slack Huddles, Cisco Webex, LeetCode, HackerRank, Karat, and CoderPad.
- **Real-Time Speech Stream**: Listens to interviewer questions via browser Speech-to-Text streaming with instant transcription.
- **Gemini 3.6 Flash Engine**: Returns high-impact, bulleted STAR responses, trade-offs, and key metrics in under 1 second.
- **Draggable & Transparent HUD**: Overlay with customizable opacity slider, click-through mode, and quick hide shortcuts so it stays invisible to screen shares.
- **Candidate Context Integration**: Integrates your target role, company, and resume highlights so Gemini personalizes every suggestion with your real metrics.
- **Chrome Extension (Manifest V3)**: Bundled standalone extension with a 1-click ZIP exporter for easy Chrome installation.
- **Built-in Interview Simulator**: Interactive audio generator with preset questions from top tech companies for offline practice.
- **Prep Notes & Cheat-Sheet Exporter**: Bookmark key Gemini answers and export them as Markdown (`.md`) files.

---

## 💻 Meeting Platform Compatibility

The Chrome Extension uses universal host matching (`<all_urls>`) so the overlay can be launched on **any browser tab**:

| Platform | Domain | Supported Features |
| :--- | :--- | :--- |
| **Google Meet** | `meet.google.com` | Live HUD, Speech Stream, STAR Answers |
| **Microsoft Teams** | `teams.microsoft.com` | Live HUD, Speech Stream, STAR Answers |
| **Zoom Web** | `*.zoom.us` | Live HUD, Speech Stream, STAR Answers |
| **Slack Huddles** | `*.slack.com` | Live HUD, Speech Stream, STAR Answers |
| **LeetCode / HackerRank** | `leetcode.com` / `hackerrank.com` | Live HUD, Coding Hints & Trade-offs |
| **Karat / CoderPad** | `karat.com` / `coderpad.io` | Live HUD, System Design & Algorithms |

---

## 🧩 Chrome Extension Installation

1. **Download Extension Package**:
   - Open the running application UI and navigate to the **Chrome Extension** tab.
   - Click **"Download Extension (.zip)"** to save `gemini-extension.zip`.
2. **Unzip the Files**:
   - Extract the ZIP archive into a local folder on your computer.
3. **Load in Chrome**:
   - Open Google Chrome and go to `chrome://extensions`.
   - Enable **Developer mode** in the top-right corner.
   - Click **"Load unpacked"** in the top-left corner.
   - Select the unzipped `gemini-extension` directory.
4. **Launch Overlay**:
   - Open any meeting (Google Meet, Teams, Zoom, etc.).
   - Click the **Gemini Copilot** extension icon from your Chrome browser toolbar and press **"Launch HUD Overlay on Page"**.

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Gemini API Key (from [Google AI Studio](https://aistudio.google.com/))

### 2. Environment Configuration
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Add your Gemini API key in `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
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

## 📦 Deployment Steps

### Option 1: Docker / Cloud Run Container Deployment
1. Build production assets and bundle the server:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```
   The server binds to `0.0.0.0:3000` by default.

### Option 2: Deploying to Vercel or Render
1. Connect your repository to Vercel/Render.
2. Set Environment Variable: `GEMINI_API_KEY` = `your_key`.
3. Set Build Command: `npm run build`
4. Set Output Directory: `dist`

---

## 🔒 Security & Privacy (GitHub Best Practices)

To ensure your repository remains clean and free of private tokens or personal prompt histories:

- **Environment Variables**: Never commit `.env` files. Ensure `.env` is listed in `.gitignore`.
- **API Key Proxying**: All Gemini API calls are made server-side via `/api/interview/copilot` so API keys are never exposed in client bundles or network requests.
- **Local Storage**: Resume highlights and STAR preferences stay in local browser storage (`chrome.storage.local`) and are never committed to git logs.

---

## 📄 License
MIT License.
