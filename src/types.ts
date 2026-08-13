export interface CandidateProfile {
  name: string;
  targetRole: string;
  targetCompany: string;
  experienceLevel: string;
  yearsOfExperience: number;
  resumeHighlights: string;
  keySkills: string[];
  preferredFramework: string; // e.g., STAR, Concise, Technical
}

export interface TranscriptItem {
  id: string;
  speaker: 'interviewer' | 'candidate' | 'system';
  text: string;
  timestamp: string;
  isFinal: boolean;
}

export interface StarAnswer {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface CopilotSuggestions {
  questionIdentified: string;
  talkingPoints: string[];
  starAnswer: StarAnswer;
  keyMetricsAndKeywords: string[];
  technicalSnippet: string;
  proactiveTips: string;
  confidenceScore?: number;
  generatedAt?: string;
}

export interface OverlaySettings {
  opacity: number; // 0.1 to 1.0
  dockPosition: 'top-right' | 'bottom-right' | 'top-bar' | 'floating' | 'sidebar';
  theme: 'dark-glass' | 'light-glass' | 'cyber-dark' | 'stealth-minimal';
  isClickThrough: boolean;
  fontSize: 'small' | 'medium' | 'large';
  autoTriggerOnSilence: boolean;
  activeTab: 'copilot' | 'transcript' | 'profile' | 'extension-code' | 'notes';
  isMinimized: boolean;
  showInterviewerSim: boolean;
  liveListening: boolean;
}

export interface InterviewScenario {
  id: string;
  title: string;
  company: string;
  role: string;
  category: 'Behavioral' | 'System Design' | 'Coding' | 'Product Strategy' | 'Leadership';
  questions: {
    questionText: string;
    sampleContext: string;
    audioText: string;
  }[];
}

export interface ChromeExtensionFile {
  filename: string;
  content: string;
  language: string;
  description: string;
}
