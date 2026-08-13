import React from 'react';
import { 
  Sparkles, 
  Download, 
  UserCheck, 
  Layers, 
  Mic, 
  MicOff, 
  Sliders, 
  Maximize2, 
  Minimize2,
  Code2,
  BookOpen,
  Monitor
} from 'lucide-react';
import { OverlaySettings, CandidateProfile } from '../types';

interface NavbarProps {
  settings: OverlaySettings;
  setSettings: React.Dispatch<React.SetStateAction<OverlaySettings>>;
  profile: CandidateProfile;
  onOpenProfile: () => void;
  onDownloadExtension: () => void;
  isSimulatingMeeting: boolean;
  setIsSimulatingMeeting: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  setSettings,
  profile,
  onOpenProfile,
  onDownloadExtension,
  isSimulatingMeeting,
  setIsSimulatingMeeting,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0f172a]/90 backdrop-blur-xl border-b border-slate-800 text-slate-100 px-4 py-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Status */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-600 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-[#020617] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base text-white tracking-tight leading-none">
                  Gemini Flash <span className="text-indigo-400">Interview Copilot</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest">
                  v3 Manifest
                </span>
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-2 mt-1 uppercase tracking-wider font-medium">
                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
                  <span className="text-emerald-400 font-bold">LIVE OVERLAY</span>
                </span>
                <span>• Gemini 3.6 Flash Active</span>
              </p>
            </div>
          </div>

          {/* Mobile Profile Trigger */}
          <button
            onClick={onOpenProfile}
            className="md:hidden p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
          >
            <UserCheck className="w-4 h-4 text-indigo-400" />
            Profile
          </button>
        </div>

        {/* Center Tabs: HUD Workbench vs Extension Code vs Meeting Background */}
        <div className="flex items-center gap-1 bg-[#020617]/80 p-1 rounded-xl border border-slate-800 text-xs w-full md:w-auto justify-center">
          <button
            onClick={() => setSettings(s => ({ ...s, activeTab: 'copilot' }))}
            className={`px-3.5 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              settings.activeTab === 'copilot'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Live HUD Simulator
          </button>

          <button
            onClick={() => setSettings(s => ({ ...s, activeTab: 'extension-code' }))}
            className={`px-3.5 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              settings.activeTab === 'extension-code'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Chrome Extension Code
          </button>

          <button
            onClick={() => setSettings(s => ({ ...s, activeTab: 'notes' }))}
            className={`px-3.5 py-1.5 rounded-lg font-bold text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              settings.activeTab === 'notes'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Prep Notes
          </button>
        </div>

        {/* Quick Controls & Profile */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Opacity Control */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700/60 text-xs">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-300 font-semibold text-[10px] uppercase tracking-wider">Opacity:</span>
            <input
              type="range"
              min="0.15"
              max="1.0"
              step="0.05"
              value={settings.opacity}
              onChange={(e) => setSettings(s => ({ ...s, opacity: parseFloat(e.target.value) }))}
              className="w-16 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span className="text-indigo-400 font-mono text-[11px] w-8 text-right font-bold">
              {Math.round(settings.opacity * 100)}%
            </span>
          </div>

          {/* Toggle Meeting Background */}
          <button
            onClick={() => setIsSimulatingMeeting(!isSimulatingMeeting)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all border ${
              isSimulatingMeeting
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Toggle Google Meet / Zoom video stage behind overlay"
          >
            <Monitor className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Stage:</span> {isSimulatingMeeting ? 'Meet Call' : 'Clean'}
          </button>

          {/* Profile Button */}
          <button
            onClick={onOpenProfile}
            className="hidden md:flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-[11px]">{profile.targetRole || 'Edit Profile'}</span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono border border-indigo-500/30 font-bold">
              {profile.targetCompany || 'Target'}
            </span>
          </button>

          {/* Download Extension Zip */}
          <button
            onClick={onDownloadExtension}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 py-1.5 rounded-lg text-[11px] uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-indigo-500/25 transition-all transform active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Zip</span>
          </button>
        </div>

      </div>
    </header>
  );
};
