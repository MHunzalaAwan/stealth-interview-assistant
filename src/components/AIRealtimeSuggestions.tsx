import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Volume2, 
  Star, 
  Lightbulb, 
  Code, 
  Target, 
  AlertTriangle,
  RefreshCw,
  Gauge,
  Activity
} from 'lucide-react';
import { CopilotSuggestions } from '../types';

interface AIRealtimeSuggestionsProps {
  suggestions: CopilotSuggestions | null;
  isLoading: boolean;
  onRefreshSuggestions: () => void;
  onSaveNote: (title: string, text: string) => void;
  isCompact?: boolean;
}

export const AIRealtimeSuggestions: React.FC<AIRealtimeSuggestionsProps> = ({
  suggestions,
  isLoading,
  onRefreshSuggestions,
  onSaveNote,
  isCompact = false
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'points' | 'star' | 'tech' | 'tips'>('points');
  const [speaking, setSpeaking] = useState(false);
  const [savedStar, setSavedStar] = useState(false);

  const handleCopy = () => {
    if (!suggestions) return;
    const text = `
QUESTION: ${suggestions.questionIdentified}
TALKING POINTS:
${suggestions.talkingPoints.map(p => `• ${p}`).join('\n')}
STAR METHOD:
Situation: ${suggestions.starAnswer.situation}
Task: ${suggestions.starAnswer.task}
Action: ${suggestions.starAnswer.action}
Result: ${suggestions.starAnswer.result}
KEYWORDS: ${suggestions.keyMetricsAndKeywords.join(', ')}
    `;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!suggestions || !('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const textToSpeak = suggestions.talkingPoints.join('. ');
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.onend = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (isLoading) {
    return (
      <div className="p-5 bg-[#020617]/90 border border-indigo-500/30 rounded-2xl flex flex-col items-center justify-center text-center gap-3 min-h-[180px] shadow-xl backdrop-blur-xl">
        <div className="relative">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin" />
          <Sparkles className="w-5 h-5 text-indigo-400 absolute top-2.5 left-2.5 animate-pulse" />
        </div>
        <div>
          <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 justify-center">
            ✦ Gemini 3.6 Flash Analyzing Interview Transcript...
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Generating instant candidate talking points & STAR answer...</p>
        </div>
      </div>
    );
  }

  if (!suggestions) {
    return (
      <div className="p-5 bg-[#020617]/60 border border-slate-800 rounded-2xl text-center flex flex-col items-center gap-2 text-slate-400">
        <Sparkles className="w-6 h-6 text-indigo-400/60" />
        <p className="text-xs font-bold uppercase tracking-wider text-slate-300">Awaiting Interviewer Question...</p>
        <p className="text-[11px] text-slate-400 max-w-xs">
          Speak into the mic or click a scenario question to trigger instant Gemini Flash recommendations.
        </p>
      </div>
    );
  }

  const score = suggestions.confidenceScore || 96;
  const scoreStyle = score >= 90 
    ? { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', fill: 'bg-emerald-500', label: 'High Match' }
    : score >= 75
    ? { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/30', fill: 'bg-indigo-500', label: 'Good Match' }
    : { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', fill: 'bg-amber-500', label: 'Moderate' };

  return (
    <div className="flex flex-col gap-3 font-sans text-slate-100">
      
      {/* Question Header Banner */}
      <div className="bg-[#020617]/90 border border-indigo-500/30 rounded-2xl p-3.5 shadow-inner">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-[10px] font-bold tracking-widest text-indigo-400 flex items-center gap-1 uppercase">
            <Target className="w-3.5 h-3.5" /> Question Identified
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleSpeak}
              className={`p-1 rounded hover:bg-slate-800 transition-all ${speaking ? 'text-indigo-400 animate-pulse' : 'text-slate-400'}`}
              title="Practice speaking bullet points out loud"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCopy}
              className="p-1 rounded text-slate-400 hover:bg-slate-800 transition-all"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                onSaveNote(suggestions.questionIdentified, suggestions.talkingPoints.join('\n'));
                setSavedStar(true);
                setTimeout(() => setSavedStar(false), 2000);
              }}
              className={`p-1 rounded hover:bg-slate-800 transition-all ${savedStar ? 'text-amber-400' : 'text-slate-400'}`}
              title="Save to Prep Notes"
            >
              <Star className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onRefreshSuggestions}
              className="p-1 rounded text-slate-400 hover:bg-slate-800 transition-all hover:rotate-180 duration-300"
              title="Regenerate answer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <p className="text-xs font-semibold text-white leading-relaxed italic">
          "{suggestions.questionIdentified}"
        </p>

        {/* Confidence Score Bar */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <Gauge className="w-3.5 h-3.5 text-indigo-400" />
            <span>Context Relevance Score:</span>
          </div>

          <div className={`flex items-center gap-2 px-2.5 py-0.5 rounded-full border ${scoreStyle.bg} ${scoreStyle.border}`}>
            <div className="w-12 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div 
                className={`h-full ${scoreStyle.fill} transition-all duration-500`} 
                style={{ width: `${score}%` }}
              />
            </div>
            <span className={`text-[10px] font-mono font-bold ${scoreStyle.text}`}>
              {score}% ({scoreStyle.label})
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1 bg-[#020617] p-1 rounded-xl border border-slate-800 text-[10px] font-bold uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('points')}
          className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
            activeTab === 'points' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          Points
        </button>

        <button
          onClick={() => setActiveTab('star')}
          className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
            activeTab === 'star' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-3 h-3" />
          STAR
        </button>

        {suggestions.technicalSnippet && (
          <button
            onClick={() => setActiveTab('tech')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeTab === 'tech' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3 h-3" />
            Code
          </button>
        )}

        <button
          onClick={() => setActiveTab('tips')}
          className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
            activeTab === 'tips' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lightbulb className="w-3 h-3" />
          Tips
        </button>
      </div>

      {/* Tab Content Display */}
      <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-3.5 space-y-3 max-h-[320px] overflow-y-auto custom-scrollbar">
        
        {/* Tab 1: Talking Points */}
        {activeTab === 'points' && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              SAY THESE DIRECTLY OUT LOUD (10-SEC READ)
            </span>
            <ul className="space-y-2">
              {suggestions.talkingPoints.map((point, idx) => (
                <li key={idx} className="text-xs text-slate-200 flex items-start gap-2 bg-[#020617]/70 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                  <span className="text-indigo-400 font-bold shrink-0 mt-0.5">•</span>
                  <span dangerouslySetInnerHTML={{ 
                    __html: point.replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-300 font-bold">$1</strong>') 
                  }} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab 2: STAR Answer */}
        {activeTab === 'star' && (
          <div className="space-y-2.5 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              STAR FRAMEWORK RESPONSE
            </span>
            
            {suggestions.starAnswer.situation && (
              <div className="bg-[#020617]/70 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px] block mb-0.5">S - Situation:</span>
                <span className="text-slate-300 leading-relaxed">{suggestions.starAnswer.situation}</span>
              </div>
            )}

            {suggestions.starAnswer.task && (
              <div className="bg-[#020617]/70 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px] block mb-0.5">T - Task:</span>
                <span className="text-slate-300 leading-relaxed">{suggestions.starAnswer.task}</span>
              </div>
            )}

            {suggestions.starAnswer.action && (
              <div className="bg-[#020617]/70 p-3 rounded-xl border border-indigo-500/30">
                <span className="font-bold text-indigo-300 uppercase tracking-wider text-[10px] block mb-0.5">A - Action:</span>
                <span className="text-white font-medium leading-relaxed">{suggestions.starAnswer.action}</span>
              </div>
            )}

            {suggestions.starAnswer.result && (
              <div className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/30">
                <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] block mb-0.5">R - Result:</span>
                <span className="text-emerald-100 font-semibold leading-relaxed">{suggestions.starAnswer.result}</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Technical Snippet */}
        {activeTab === 'tech' && suggestions.technicalSnippet && (
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
              LOGIC / SYSTEM DESIGN OVERVIEW
            </span>
            <pre className="bg-[#020617] p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-indigo-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {suggestions.technicalSnippet}
            </pre>
          </div>
        )}

        {/* Tab 4: Tips & Metrics */}
        {activeTab === 'tips' && (
          <div className="space-y-3 text-xs">
            {/* Keywords */}
            {suggestions.keyMetricsAndKeywords.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                  KEY KEYWORDS TO USE
                </span>
                <div className="flex flex-wrap gap-2">
                  {suggestions.keyMetricsAndKeywords.map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg text-[10px] border border-slate-700 font-semibold">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Proactive Pitfalls */}
            {suggestions.proactiveTips && (
              <div className="bg-indigo-500/10 border border-indigo-500/30 p-3 rounded-xl text-slate-200">
                <span className="font-bold flex items-center gap-1.5 text-[11px] mb-1 uppercase tracking-wider text-indigo-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-indigo-400" /> Confidence Tip:
                </span>
                <p className="text-[11px] text-slate-300 italic leading-relaxed">
                  "{suggestions.proactiveTips}"
                </p>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
