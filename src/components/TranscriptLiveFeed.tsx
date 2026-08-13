import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Send, Radio, MessageSquare, Trash2, Volume2 } from 'lucide-react';
import { TranscriptItem } from '../types';

interface TranscriptLiveFeedProps {
  transcriptItems: TranscriptItem[];
  isListening: boolean;
  onToggleListening: () => void;
  onSendManualTranscript: (text: string, speaker: 'interviewer' | 'candidate') => void;
  onClearTranscript: () => void;
}

export const TranscriptLiveFeed: React.FC<TranscriptLiveFeedProps> = ({
  transcriptItems,
  isListening,
  onToggleListening,
  onSendManualTranscript,
  onClearTranscript
}) => {
  const [inputText, setInputText] = useState('');
  const [speakerMode, setSpeakerMode] = useState<'interviewer' | 'candidate'>('interviewer');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcriptItems]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendManualTranscript(inputText.trim(), speakerMode);
    setInputText('');
  };

  return (
    <div className="bg-[#020617]/80 border border-slate-800 rounded-2xl p-3 flex flex-col gap-2.5">
      
      {/* Feed Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              {isListening ? 'LIVE' : 'OFF'}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
            Current Transcript
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Audio Equalizer animation when listening */}
          {isListening && (
            <div className="flex items-end gap-0.5 h-3 px-1">
              <span className="w-0.5 h-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-0.5 h-2/3 bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-0.5 h-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="w-0.5 h-1/2 bg-emerald-400 animate-bounce" style={{ animationDelay: '450ms' }} />
            </div>
          )}

          <button
            onClick={onToggleListening}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-all ${
              isListening
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
            <span>{isListening ? 'Listening' : 'Start Mic'}</span>
          </button>

          <button
            onClick={onClearTranscript}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            title="Clear transcript history"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Transcript Scroll Box */}
      <div 
        ref={scrollRef}
        className="bg-[#0f172a]/70 border border-slate-800 rounded-xl p-2.5 h-[130px] overflow-y-auto space-y-2 custom-scrollbar text-xs"
      >
        {transcriptItems.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 italic text-[11px] text-center">
            No speech detected yet. Start mic or type an interviewer question below...
          </div>
        ) : (
          transcriptItems.map((item) => (
            <div 
              key={item.id}
              className={`p-2.5 rounded-xl border leading-relaxed flex flex-col gap-0.5 ${
                item.speaker === 'interviewer'
                  ? 'bg-indigo-950/40 border-indigo-500/30 text-slate-200'
                  : item.speaker === 'candidate'
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-100'
                  : 'bg-slate-800/50 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="font-bold uppercase tracking-wider text-indigo-400">
                  {item.speaker === 'interviewer' ? 'Interviewer:' : 'You (Candidate):'}
                </span>
                <span className="text-slate-500">{item.timestamp}</span>
              </div>
              <p className="text-xs font-sans mt-0.5 italic text-slate-200">{item.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Manual Speech Input Bar */}
      <form onSubmit={handleSubmit} className="flex items-center gap-1.5">
        <div className="flex bg-[#0f172a] rounded-lg border border-slate-800 p-0.5 text-[9px] font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setSpeakerMode('interviewer')}
            className={`px-2 py-1 rounded transition-all ${
              speakerMode === 'interviewer' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interviewer
          </button>
          <button
            type="button"
            onClick={() => setSpeakerMode('candidate')}
            className={`px-2 py-1 rounded transition-all ${
              speakerMode === 'candidate' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Candidate
          </button>
        </div>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Type ${speakerMode === 'interviewer' ? 'interviewer question...' : 'your answer...'}`}
          className="flex-1 bg-[#0f172a] border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold p-1.5 rounded-lg transition-all shadow-md shadow-indigo-500/20"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
};
