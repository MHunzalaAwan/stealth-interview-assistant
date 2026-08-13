import React, { useState, useEffect, useCallback } from 'react';
import { 
  OverlaySettings, 
  CandidateProfile, 
  TranscriptItem, 
  CopilotSuggestions 
} from './types';
import { Navbar } from './components/Navbar';
import { SimulatedMeetingBackground } from './components/SimulatedMeetingBackground';
import { OverlayHUD } from './components/OverlayHUD';
import { CandidateProfileModal } from './components/CandidateProfileModal';
import { InterviewerSimulator } from './components/InterviewerSimulator';
import { ChromeExtensionViewer } from './components/ChromeExtensionViewer';
import { NotesAndHistory } from './components/NotesAndHistory';
import { generateExtensionZipBlob } from './data/extensionFiles';
import { Sparkles, Mic, Layers, Code2, BookOpen } from 'lucide-react';

export default function App() {
  // Candidate Profile State
  const [profile, setProfile] = useState<CandidateProfile>({
    name: 'Alex Chen',
    targetRole: 'Senior Software Engineer',
    targetCompany: 'Google / Tech Leader',
    experienceLevel: 'Senior (5-8 yrs)',
    yearsOfExperience: 6,
    resumeHighlights: 'Led payments service redesign reducing latency by 45% (p99 < 50ms). Built real-time WebSockets engine handling 120k concurrent connections. Experienced in React, TypeScript, Node.js, ScyllaDB, Go, Docker.',
    keySkills: ['System Design', 'React/TypeScript', 'Distributed Databases', 'WebSockets', 'GraphQL'],
    preferredFramework: 'STAR Method'
  });

  // HUD Overlay Settings
  const [settings, setSettings] = useState<OverlaySettings>({
    opacity: 0.85,
    dockPosition: 'top-right',
    theme: 'dark-glass',
    isClickThrough: false,
    fontSize: 'medium',
    autoTriggerOnSilence: true,
    activeTab: 'copilot',
    isMinimized: false,
    showInterviewerSim: true,
    liveListening: false
  });

  // Speech Transcript State
  const [transcriptItems, setTranscriptItems] = useState<TranscriptItem[]>([
    {
      id: 'init-1',
      speaker: 'interviewer',
      text: 'Design a global real-time chat application for 100 million daily active users. Explain your web socket gateway and ScyllaDB storage tier.',
      timestamp: '17:15',
      isFinal: true
    }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [currentSpeakerText, setCurrentSpeakerText] = useState('');
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);

  // Gemini Flash Copilot Suggestions State
  const [copilotSuggestions, setCopilotSuggestions] = useState<CopilotSuggestions | null>({
    questionIdentified: "Design a global real-time chat app for 100M DAU with WebSocket gateways & ScyllaDB",
    talkingPoints: [
      "State **high-level architecture**: Client -> Anycast L7 LB -> WebSocket Gateways -> Message Bus (Kafka) -> ScyllaDB.",
      "Highlight **WebSocket statefulness**: Connection registry stored in Redis cluster to route user-to-user messages by session ID.",
      "Address **ScyllaDB write throughput**: Partition messages by `(channel_id, bucket_day)` to prevent hotspotting on popular group chats.",
      "Mention **offline message sync**: Use sequence ID offsets so clients fetch missing messages upon reconnect."
    ],
    starAnswer: {
      situation: "In my previous role, our messaging service hit DB IOPS bottlenecks at 50k concurrent users during peak traffic.",
      task: "I was tasked with redesigning the real-time pipeline to support 100k+ DAU with sub-50ms latency.",
      action: "I implemented a WebSocket connection manager with ScyllaDB partition keys bucketed by day, and integrated Redis pub/sub.",
      result: "Achieved 45% latency reduction, zero write dropped frames, and scaled effortlessly to 120k concurrent sockets."
    },
    keyMetricsAndKeywords: ["WebSocket Gateways", "ScyllaDB Sharding", "Redis Pub/Sub", "p99 < 50ms", "Kafka Ingestion"],
    technicalSnippet: `// ScyllaDB Table Schema for Messages
CREATE TABLE chat.messages (
  channel_id uuid,
  bucket_day text,
  sequence_id timeuuid,
  sender_id uuid,
  content text,
  PRIMARY KEY ((channel_id, bucket_day), sequence_id)
) WITH CLUSTERING ORDER BY (sequence_id DESC);`,
    proactiveTips: "Be ready to explain how you handle network disconnects and deduplication during retries."
  });
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Profile Modal State
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Stage Meeting Background State
  const [isSimulatingMeeting, setIsSimulatingMeeting] = useState(true);

  // Saved Notes State
  const [notes, setNotes] = useState<{ id: string; title: string; content: string; createdAt: string }[]>([
    {
      id: 'n-1',
      title: 'Google System Design: Real-time Chat ScyllaDB Partitioning',
      content: 'Partition key: (channel_id, bucket_day). Prevents single partition overflow in active group chats.',
      createdAt: 'Today, 17:10'
    }
  ]);

  // Fetch Gemini Flash Advice from Backend Server
  const fetchCopilotAdvice = useCallback(async (transcriptText: string) => {
    setIsLoadingSuggestions(true);
    try {
      const response = await fetch('/api/interview/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcriptText,
          jobRole: profile.targetRole,
          company: profile.targetCompany,
          experienceLevel: profile.experienceLevel,
          resumeContext: profile.resumeHighlights,
          mode: profile.preferredFramework === 'STAR Method' ? 'star_method' : 'realtime_suggestions'
        })
      });

      const result = await response.json();
      if (result.success && result.data) {
        setCopilotSuggestions(result.data);
      }
    } catch (error) {
      console.error('Error fetching copilot advice:', error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [profile]);

  // Handle Manual or Simulated Speech Trigger
  const handleSendManualTranscript = useCallback((text: string, speaker: 'interviewer' | 'candidate') => {
    const newItem: TranscriptItem = {
      id: `t-${Date.now()}`,
      speaker,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFinal: true
    };

    setTranscriptItems(prev => [...prev, newItem]);
    if (speaker === 'interviewer') {
      setCurrentSpeakerText(text);
      setIsInterviewerSpeaking(true);
      fetchCopilotAdvice(text);
      setTimeout(() => setIsInterviewerSpeaking(false), 4000);
    }
  }, [fetchCopilotAdvice]);

  // Handle Web Speech API Mic Listener
  useEffect(() => {
    let recognition: any = null;

    if (isListening) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript.trim().length > 8) {
            handleSendManualTranscript(finalTranscript, 'interviewer');
          }
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition notice:', e?.error);
        };

        try {
          recognition.start();
        } catch (e) {
          console.warn('Recognition already started');
        }
      } else {
        alert('Web Speech API is not supported in this browser environment. You can use manual questions or preset scenarios!');
        setIsListening(false);
      }
    }

    return () => {
      if (recognition) {
        try { recognition.stop(); } catch {}
      }
    };
  }, [isListening, handleSendManualTranscript]);

  const handleDownloadExtension = async () => {
    try {
      const blob = await generateExtensionZipBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gemini-interview-copilot-extension.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNote = (title: string, content: string) => {
    const newNote = {
      id: `n-${Date.now()}`,
      title,
      content,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotes(prev => [newNote, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500/30">
      
      {/* Top Navbar */}
      <Navbar
        settings={settings}
        setSettings={setSettings}
        profile={profile}
        onOpenProfile={() => setIsProfileOpen(true)}
        onDownloadExtension={handleDownloadExtension}
        isSimulatingMeeting={isSimulatingMeeting}
        setIsSimulatingMeeting={setIsSimulatingMeeting}
      />

      {/* Main Workspace Stage */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6 relative">
        
        {/* TAB 1: Live HUD Simulator & Interview Workbench */}
        {settings.activeTab === 'copilot' && (
          <div className="space-y-6">
            
            {/* Draggable Glass Transparent Overlay HUD */}
            <OverlayHUD
              settings={settings}
              setSettings={setSettings}
              suggestions={copilotSuggestions}
              isLoadingSuggestions={isLoadingSuggestions}
              onRefreshSuggestions={() => {
                if (transcriptItems.length > 0) {
                  fetchCopilotAdvice(transcriptItems[transcriptItems.length - 1].text);
                }
              }}
              transcriptItems={transcriptItems}
              isListening={isListening}
              onToggleListening={() => setIsListening(!isListening)}
              onSendManualTranscript={handleSendManualTranscript}
              onClearTranscript={() => setTranscriptItems([])}
              onSaveNote={handleSaveNote}
              profile={profile}
              onOpenProfile={() => setIsProfileOpen(true)}
            />

            {/* Video Call Background Stage (Google Meet / Zoom Simulation) */}
            {isSimulatingMeeting && (
              <div className="relative">
                <SimulatedMeetingBackground
                  currentSpeakerText={currentSpeakerText}
                  isInterviewerSpeaking={isInterviewerSpeaking}
                />
              </div>
            )}

            {/* Interviewer Audio & Dialogue Simulator Box */}
            <InterviewerSimulator
              onSimulateQuestion={(qText) => handleSendManualTranscript(qText, 'interviewer')}
              isInterviewerSpeaking={isInterviewerSpeaking}
            />

          </div>
        )}

        {/* TAB 2: Chrome Extension Manifest V3 Source Code & ZIP Exporter */}
        {settings.activeTab === 'extension-code' && (
          <ChromeExtensionViewer />
        )}

        {/* TAB 3: Prep Notes & History */}
        {settings.activeTab === 'notes' && (
          <NotesAndHistory
            notes={notes}
            onAddNote={handleSaveNote}
            onDeleteNote={(id) => setNotes(prev => prev.filter(n => n.id !== id))}
          />
        )}

      </main>

      {/* Candidate Profile Modal Drawer */}
      <CandidateProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={setProfile}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500">
        <p>
          Gemini Flash Real-Time Interview Copilot Chrome Extension • Powered by <span className="text-sky-400 font-semibold">Gemini 3.6 Flash</span> Server API
        </p>
      </footer>

    </div>
  );
}
