import React, { useState } from 'react';
import { X, UserCheck, Sparkles, Save, Check } from 'lucide-react';
import { CandidateProfile } from '../types';

interface CandidateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CandidateProfile;
  onSaveProfile: (profile: CandidateProfile) => void;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  const [formData, setFormData] = useState<CandidateProfile>({ ...profile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0f172a] border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-[#020617]/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Candidate Profile & Target Role</h3>
              <p className="text-[11px] text-slate-400">Gemini Flash tailors STAR answers & talking points based on this</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Candidate Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Alex Chen"
                className="w-full bg-[#020617] border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Experience Level
              </label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                className="w-full bg-[#020617] border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Junior / Entry">Junior / Entry Level</option>
                <option value="Mid Level (3-5 yrs)">Mid Level (3-5 yrs)</option>
                <option value="Senior (5-8 yrs)">Senior (5-8 yrs)</option>
                <option value="Staff / Principal (8+ yrs)">Staff / Principal (8+ yrs)</option>
                <option value="Manager / Director">Manager / Director</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Target Role
              </label>
              <input
                type="text"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                placeholder="e.g. Senior Software Engineer"
                className="w-full bg-[#020617] border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Target Company
              </label>
              <input
                type="text"
                value={formData.targetCompany}
                onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
                placeholder="e.g. Google, Stripe, Meta"
                className="w-full bg-[#020617] border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Resume Context & Top Achievements
            </label>
            <textarea
              rows={4}
              value={formData.resumeHighlights}
              onChange={(e) => setFormData({ ...formData, resumeHighlights: e.target.value })}
              placeholder="e.g. Led redesign of payments service reducing latency by 45%. Built real-time WebSocket messaging handling 100k DAU. Tech stack: React, TypeScript, Node.js, Go, ScyllaDB, AWS, Docker."
              className="w-full bg-[#020617] border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500 font-sans"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Tip: Include specific metrics (% performance increase, scale numbers) so Gemini embeds them in STAR responses.
            </p>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Preferred Answer Delivery Style
            </label>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              {['STAR Method', 'Concise Bullets', 'Technical Deep-Dive'].map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setFormData({ ...formData, preferredFramework: style })}
                  className={`py-2 px-3 rounded-xl border font-bold uppercase tracking-wider text-center transition-all text-[10px] ${
                    formData.preferredFramework === style
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-[#020617] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" /> Context saved locally
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 transition-all"
              >
                {savedSuccess ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
                <span>{savedSuccess ? 'Saved!' : 'Save Profile'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
