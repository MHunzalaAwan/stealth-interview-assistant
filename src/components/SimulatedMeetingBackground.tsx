import React, { useState } from 'react';
import { Mic, Video, PhoneOff, Share2, MessageSquare, Users, Shield, Radio, Volume2 } from 'lucide-react';

interface SimulatedMeetingBackgroundProps {
  currentSpeakerText?: string;
  isInterviewerSpeaking?: boolean;
}

export const SimulatedMeetingBackground: React.FC<SimulatedMeetingBackgroundProps> = ({
  currentSpeakerText,
  isInterviewerSpeaking
}) => {
  const [meetingMuted, setMeetingMuted] = useState(false);
  const [videoOn, setVideoOn] = useState(true);

  return (
    <div className="relative w-full h-[620px] rounded-3xl overflow-hidden bg-[#020617] border border-slate-800 shadow-2xl flex flex-col justify-between p-4 selection:bg-none">
      
      {/* Top Bar - Video Call Info */}
      <div className="relative z-10 flex items-center justify-between bg-[#0f172a]/90 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">LIVE</span>
          </div>
          <span className="font-bold text-white text-xs">Google Meet • Google System Design Interview</span>
          <span className="bg-[#020617] text-slate-400 px-2.5 py-0.5 rounded-md font-mono text-[10px] border border-slate-800">
            meet.google.com/abc-interview-xzy
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-mono text-[11px] font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>00:24:18</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>Encrypted</span>
          </div>
        </div>
      </div>

      {/* Video Call Stage Grid */}
      <div className="relative z-0 my-auto grid grid-cols-1 md:grid-cols-2 gap-4 h-[460px] w-full">
        
        {/* Box 1: Interviewer (Google Lead Architect) */}
        <div className={`relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between p-4 ${
          isInterviewerSpeaking
            ? 'border-indigo-500 ring-2 ring-indigo-500/50 shadow-xl shadow-indigo-500/20 bg-gradient-to-br from-[#0f172a] via-[#0f172a] to-[#020617]'
            : 'border-slate-800 bg-[#0f172a]/90'
        }`}>
          {/* Top Status */}
          <div className="flex items-center justify-between">
            <span className="bg-[#020617]/90 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] font-semibold text-slate-200 border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              Dr. Sarah Lin • Staff Architect @ Google
            </span>

            {isInterviewerSpeaking && (
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                Interviewer Speaking
              </span>
            )}
          </div>

          {/* Visual Avatar / Simulated Stream */}
          <div className="flex flex-col items-center justify-center my-auto">
            <div className="relative">
              <div className={`w-28 h-28 rounded-full border-2 flex items-center justify-center text-3xl font-bold transition-all ${
                isInterviewerSpeaking 
                  ? 'border-indigo-400 bg-indigo-950 text-indigo-300 ring-8 ring-indigo-500/10 shadow-lg'
                  : 'border-slate-700 bg-slate-800 text-slate-300'
              }`}>
                SL
              </div>
              {isInterviewerSpeaking && (
                <div className="absolute -bottom-1 right-0 bg-indigo-600 text-white p-1.5 rounded-full border-2 border-slate-900 shadow-md">
                  <Volume2 className="w-4 h-4 animate-bounce" />
                </div>
              )}
            </div>
            
            {/* Live Audio Subtitle / Speech */}
            {isInterviewerSpeaking && currentSpeakerText && (
              <div className="mt-4 max-w-md bg-[#020617]/95 border border-indigo-500/30 text-indigo-100 text-xs px-4 py-2.5 rounded-2xl text-center shadow-2xl backdrop-blur-xl animate-fade-in">
                <p className="font-sans leading-relaxed italic">"{currentSpeakerText}"</p>
              </div>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Role: Technical Lead Interviewer</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Mic className="w-3 h-3" /> Audio Clean
            </span>
          </div>
        </div>

        {/* Box 2: Candidate (You) */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#0f172a]/90 flex flex-col justify-between p-4">
          <div className="flex items-center justify-between">
            <span className="bg-[#020617]/90 backdrop-blur-md px-3 py-1 rounded-xl text-[11px] font-semibold text-slate-200 border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              You (Candidate)
            </span>
            <span className="bg-[#020617] text-slate-400 px-2 py-0.5 rounded text-[10px] font-mono border border-slate-800">
              720p HD
            </span>
          </div>

          {/* Candidate Avatar */}
          <div className="flex flex-col items-center justify-center my-auto">
            <div className="w-28 h-28 rounded-full border-2 border-emerald-500/40 bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-200 shadow-xl">
              ME
            </div>
            <p className="text-slate-400 text-xs mt-3 flex items-center gap-1 font-medium">
              <Mic className="w-3.5 h-3.5 text-emerald-400" /> Microphone listening for candidate answers
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Gemini Overlay Docked Top-Right</span>
            <span className="text-indigo-400 font-semibold">Ready to speak</span>
          </div>
        </div>

      </div>

      {/* Bottom Meeting Control Bar */}
      <div className="relative z-10 flex items-center justify-between bg-[#0f172a]/95 backdrop-blur-xl px-6 py-3 rounded-2xl border border-slate-800">
        <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
          Google Meet Call Controls
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMeetingMuted(!meetingMuted)}
            className={`p-3 rounded-full transition-all ${
              meetingMuted ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title="Mute/Unmute Mic"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            onClick={() => setVideoOn(!videoOn)}
            className={`p-3 rounded-full transition-all ${
              !videoOn ? 'bg-red-500 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title="Toggle Camera"
          >
            <Video className="w-4 h-4" />
          </button>

          <button className="p-3 rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all">
            <Share2 className="w-4 h-4" />
          </button>

          <button className="p-3 rounded-full bg-red-600 text-white hover:bg-red-500 transition-all shadow-lg shadow-red-600/30">
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
          <Users className="w-4 h-4" /> 2 participants
        </div>
      </div>

    </div>
  );
};
