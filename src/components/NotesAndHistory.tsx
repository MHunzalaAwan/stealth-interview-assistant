import React, { useState } from 'react';
import { BookOpen, Star, Trash2, Plus, Download, FileText, Check } from 'lucide-react';

interface PrepNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface NotesAndHistoryProps {
  notes: PrepNote[];
  onAddNote: (title: string, content: string) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesAndHistory: React.FC<NotesAndHistoryProps> = ({
  notes,
  onAddNote,
  onDeleteNote
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddNote(newTitle.trim(), newContent.trim());
    setNewTitle('');
    setNewContent('');
  };

  const handleExportDoc = () => {
    const fullText = notes.map(n => `### ${n.title}\nSaved: ${n.createdAt}\n\n${n.content}\n\n---\n`).join('\n');
    const blob = new Blob([fullText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Interview-Prep-Notes-Gemini.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-slate-100 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="bg-[#0f172a]/95 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white">Starred Talking Points & Prep Notes</h2>
            <p className="text-xs text-slate-400">Save key Gemini Flash answers, metrics, and STAR points for quick review</p>
          </div>
        </div>

        {notes.length > 0 && (
          <button
            onClick={handleExportDoc}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shrink-0"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Export Markdown (.md)</span>
          </button>
        )}
      </div>

      {/* Add New Note Box */}
      <form onSubmit={handleAdd} className="bg-[#0f172a]/90 border border-slate-800 p-5 rounded-3xl space-y-3.5 text-xs shadow-xl">
        <span className="font-bold text-slate-200 flex items-center gap-2 text-xs uppercase tracking-wider">
          <Plus className="w-4 h-4 text-indigo-400" /> Add Custom Interview Cheat-Sheet Note
        </span>

        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Note title (e.g., ScyllaDB Write Bottleneck Answer, Meta STAR Story #1)"
          className="w-full bg-[#020617] border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
          required
        />

        <textarea
          rows={3}
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Key metrics, STAR points, or technical architecture notes..."
          className="w-full bg-[#020617] border border-slate-800 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-indigo-500"
        />

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-indigo-500/20"
        >
          Save Note
        </button>
      </form>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notes.length === 0 ? (
          <div className="col-span-full bg-[#0f172a]/40 border border-slate-800 rounded-3xl p-10 text-center text-slate-500 text-xs">
            No saved notes yet. Click the star icon on any Gemini Flash suggestion to bookmark it here!
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="font-bold text-xs text-indigo-300 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {note.title}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">{note.createdAt}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap mt-2 bg-[#020617] p-3 rounded-xl border border-slate-800/80">
                  {note.content}
                </p>
              </div>

              <div className="flex items-center justify-end pt-2 border-t border-slate-800">
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="text-slate-500 hover:text-red-400 text-[11px] font-semibold flex items-center gap-1 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
