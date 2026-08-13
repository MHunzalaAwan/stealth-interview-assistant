import React, { useState } from 'react';
import { Play, Volume2, Sparkles, Plus, Building2, HelpCircle, CheckCircle2 } from 'lucide-react';
import { INTERVIEW_SCENARIOS } from '../data/interviewScenarios';
import { InterviewScenario } from '../types';

interface InterviewerSimulatorProps {
  onSimulateQuestion: (questionText: string) => void;
  isInterviewerSpeaking: boolean;
}

export const InterviewerSimulator: React.FC<InterviewerSimulatorProps> = ({
  onSimulateQuestion,
  isInterviewerSpeaking
}) => {
  const [selectedScenario, setSelectedScenario] = useState<InterviewScenario>(INTERVIEW_SCENARIOS[0]);
  const [customCategory, setCustomCategory] = useState('System Design');
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);

  const handleTriggerQuestion = (qText: string) => {
    onSimulateQuestion(qText);
  };

  const handleGenerateCustomQuestion = async () => {
    setIsGeneratingQuestion(true);
    try {
      const res = await fetch('/api/interview/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: customCategory, jobRole: selectedScenario.role, company: selectedScenario.company })
      });
      const data = await res.json();
      if (data.success && data.data?.question) {
        onSimulateQuestion(data.data.question);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  return (
    <div className="bg-[#0f172a]/95 border border-slate-800 rounded-3xl p-5 space-y-4 text-slate-100 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Simulated Interviewer Audio & Dialogue</h3>
            <p className="text-[11px] text-slate-400">Select an interview scenario to test real-time HUD analysis</p>
          </div>
        </div>

        {isInterviewerSpeaking && (
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-3 py-1 rounded-full animate-pulse flex items-center gap-1.5 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> Speaking...
          </span>
        )}
      </div>

      {/* Preset Scenarios Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
        {INTERVIEW_SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            onClick={() => setSelectedScenario(sc)}
            className={`p-3 rounded-2xl border text-left transition-all ${
              selectedScenario.id === sc.id
                ? 'bg-indigo-600/15 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/30'
                : 'bg-[#020617] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
            }`}
          >
            <div className="font-bold flex items-center gap-1 text-[11px] text-indigo-400 uppercase tracking-wider">
              <Building2 className="w-3 h-3" /> {sc.company}
            </div>
            <div className="font-semibold text-white mt-1 truncate">{sc.category}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 truncate">{sc.role}</div>
          </button>
        ))}
      </div>

      {/* Active Scenario Questions List */}
      <div className="space-y-2.5 bg-[#020617]/70 p-3.5 rounded-2xl border border-slate-800">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
          CLICK TO TRIGGER QUESTION IN HUD:
        </span>

        {selectedScenario.questions.map((q, idx) => (
          <div
            key={idx}
            className="p-3 bg-[#0f172a] border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-500/40 transition-all"
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-200 leading-snug">"{q.questionText}"</p>
              <p className="text-[10px] text-slate-500 font-mono">Focus: {q.sampleContext}</p>
            </div>

            <button
              onClick={() => handleTriggerQuestion(q.questionText)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-2 rounded-xl text-[11px] uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all shadow-md shadow-indigo-500/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate</span>
            </button>
          </div>
        ))}
      </div>

      {/* AI Custom Question Generator */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-300 font-semibold text-[11px] uppercase tracking-wider">Generate Custom Question:</span>
          <select
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
            className="bg-[#020617] border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="System Design">System Design</option>
            <option value="Behavioral">Behavioral (STAR)</option>
            <option value="Coding Algorithms">Coding Algorithms</option>
            <option value="Product Strategy">Product Strategy</option>
            <option value="Leadership & Conflict">Leadership & Conflict</option>
          </select>
        </div>

        <button
          onClick={handleGenerateCustomQuestion}
          disabled={isGeneratingQuestion}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-3.5 py-1.5 rounded-lg text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all"
        >
          {isGeneratingQuestion ? (
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
          ) : (
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
          )}
          <span>{isGeneratingQuestion ? 'Generating...' : 'New Question'}</span>
        </button>
      </div>

    </div>
  );
};
