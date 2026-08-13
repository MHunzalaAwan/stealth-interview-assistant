import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Minimize2, 
  Maximize2, 
  Move, 
  Sliders, 
  Lock, 
  Unlock, 
  Layers, 
  Target, 
  Code, 
  Mic, 
  MicOff, 
  Volume2, 
  Settings,
  ChevronDown,
  ChevronUp,
  Bookmark
} from 'lucide-react';
import { OverlaySettings, CopilotSuggestions, TranscriptItem, CandidateProfile } from '../types';
import { AIRealtimeSuggestions } from './AIRealtimeSuggestions';
import { TranscriptLiveFeed } from './TranscriptLiveFeed';

interface OverlayHUDProps {
  settings: OverlaySettings;
  setSettings: React.Dispatch<React.SetStateAction<OverlaySettings>>;
  suggestions: CopilotSuggestions | null;
  isLoadingSuggestions: boolean;
  onRefreshSuggestions: () => void;
  transcriptItems: TranscriptItem[];
  isListening: boolean;
  onToggleListening: () => void;
  onSendManualTranscript: (text: string, speaker: 'interviewer' | 'candidate') => void;
  onClearTranscript: () => void;
  onSaveNote: (title: string, text: string) => void;
  profile: CandidateProfile;
  onOpenProfile: () => void;
}

export const OverlayHUD: React.FC<OverlayHUDProps> = ({
  settings,
  setSettings,
  suggestions,
  isLoadingSuggestions,
  onRefreshSuggestions,
  transcriptItems,
  isListening,
  onToggleListening,
  onSendManualTranscript,
  onClearTranscript,
  onSaveNote,
  profile,
  onOpenProfile
}) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isClickThrough, setIsClickThrough] = useState(settings.isClickThrough);
  const [showTranscriptPanel, setShowTranscriptPanel] = useState(true);

  const hudRef = useRef<HTMLDivElement>(null);

  // Mouse Dragging Logic for the Overlay Window
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button, input, select, textarea')) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: Math.max(10, Math.min(window.innerWidth - 440, e.clientX - dragOffset.x)),
        y: Math.max(10, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Position class handling if docked
  const getDockStyle = () => {
    if (settings.dockPosition === 'top-right') {
      return { top: '20px', right: '20px' };
    }
    if (settings.dockPosition === 'bottom-right') {
      return { bottom: '20px', right: '20px' };
    }
    return { top: `${position.y}px`, left: `${position.x}px` };
  };

  if (settings.isMinimized) {
    return (
      <div 
        style={getDockStyle()}
        className="fixed z-50 transition-opacity duration-200"
      >
        <button
          onClick={() => setSettings(s => ({ ...s, isMinimized: false }))}
          className="bg-[#0f172a]/95 border border-indigo-500/40 text-indigo-400 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-xl flex items-center gap-2 hover:bg-slate-900 transition-all hover:scale-105"
        >
          <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-wide pr-1">Gemini Copilot HUD</span>
          <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={hudRef}
      style={{
        ...getDockStyle(),
        opacity: settings.opacity,
        pointerEvents: isClickThrough ? 'none' : 'auto'
      }}
      className={`fixed z-50 w-[420px] max-w-[calc(100vw-30px)] rounded-3xl overflow-hidden transition-opacity duration-150 shadow-2xl border ${
        settings.theme === 'light-glass'
          ? 'bg-white/85 text-slate-900 border-indigo-500/30 shadow-indigo-500/10'
          : 'bg-[#0f172a]/95 text-slate-100 border-slate-700/80 shadow-indigo-500/10'
      } backdrop-blur-xl selection:bg-indigo-500/30`}
    >
      {/* Header Bar (Draggable handle) */}
      <div
        onMouseDown={handleMouseDown}
        className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between cursor-move user-select-none select-none"
      >
        <div className="flex items-center gap-2.5">
          <Move className="w-3.5 h-3.5 text-slate-500 cursor-grab active:cursor-grabbing" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
          <span className="font-bold text-xs text-white tracking-tight flex items-center gap-1.5">
            Gemini Flash <span className="text-indigo-400">Copilot</span>
          </span>
          <span className="bg-indigo-500/10 text-indigo-400 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-indigo-500/20">
            Transparent HUD
          </span>
        </div>

        {/* HUD Controls */}
        <div className="flex items-center gap-1.5">
          {/* Opacity slider inside header */}
          <div className="flex items-center gap-1 bg-[#020617]/80 px-2 py-0.5 rounded-md border border-slate-800 text-[10px]">
            <Sliders className="w-3 h-3 text-slate-400" />
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={settings.opacity}
              onChange={(e) => setSettings(s => ({ ...s, opacity: parseFloat(e.target.value) }))}
              className="w-12 h-1 bg-slate-700 rounded appearance-none cursor-pointer accent-indigo-500"
              title="Adjust Transparency"
            />
          </div>

          {/* Click-Through lock */}
          <button
            onClick={() => {
              setIsClickThrough(!isClickThrough);
              setSettings(s => ({ ...s, isClickThrough: !isClickThrough }));
            }}
            className={`p-1 rounded text-xs transition-all ${
              isClickThrough ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'text-slate-400 hover:bg-slate-800'
            }`}
            title={isClickThrough ? "Click-through mode active" : "Enable click-through mode"}
          >
            {isClickThrough ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>

          {/* Profile settings */}
          <button
            onClick={onOpenProfile}
            className="p-1 rounded text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-all"
            title="Edit Candidate Profile Context"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Minimize */}
          <button
            onClick={() => setSettings(s => ({ ...s, isMinimized: true }))}
            className="p-1 rounded text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all"
            title="Minimize HUD"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 space-y-3.5 max-h-[520px] overflow-y-auto custom-scrollbar">
        
        {/* Candidate Context Pill */}
        <div className="flex items-center justify-between text-[11px] bg-[#020617]/60 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-indigo-400 font-bold uppercase tracking-wider text-[10px]">Target:</span>
            <span className="font-semibold text-slate-100 truncate">{profile.targetRole || 'Software Engineer'}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{profile.targetCompany || 'Tech Company'}</span>
          </div>
          <button 
            onClick={onOpenProfile}
            className="text-indigo-400 hover:underline font-bold text-[10px] uppercase tracking-wider shrink-0"
          >
            Edit
          </button>
        </div>

        {/* Real-time Gemini Flash Suggestions Card */}
        <AIRealtimeSuggestions
          suggestions={suggestions}
          isLoading={isLoadingSuggestions}
          onRefreshSuggestions={onRefreshSuggestions}
          onSaveNote={onSaveNote}
        />

        {/* Collapsible Speech Transcript Section */}
        <div className="border-t border-slate-800/80 pt-2">
          <button
            onClick={() => setShowTranscriptPanel(!showTranscriptPanel)}
            className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-200 py-1"
          >
            <span className="font-semibold flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-sky-400" /> Speech Stream & Input
            </span>
            {showTranscriptPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showTranscriptPanel && (
            <div className="mt-1.5">
              <TranscriptLiveFeed
                transcriptItems={transcriptItems}
                isListening={isListening}
                onToggleListening={onToggleListening}
                onSendManualTranscript={onSendManualTranscript}
                onClearTranscript={onClearTranscript}
              />
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
