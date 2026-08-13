import React, { useState } from 'react';
import { Download, Code2, Copy, Check, FileCode, Chrome, ArrowRight, ExternalLink, ShieldCheck } from 'lucide-react';
import { CHROME_EXTENSION_FILES, generateExtensionZipBlob } from '../data/extensionFiles';

export const ChromeExtensionViewer: React.FC = () => {
  const [selectedFilename, setSelectedFilename] = useState('manifest.json');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const currentFile = CHROME_EXTENSION_FILES.find(f => f.filename === selectedFilename) || CHROME_EXTENSION_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsDownloading(true);
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
      console.error('Error generating zip:', e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100 max-w-6xl mx-auto">
      
      {/* Banner & Install Steps */}
      <div className="bg-[#0f172a]/95 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
              <Chrome className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Chrome Extension Manifest V3 Package</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Install this extension locally to get the transparent HUD overlay directly on Google Meet, Zoom, or LeetCode!
              </p>
            </div>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold uppercase tracking-wider px-6 py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 transition-all shrink-0 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Bundling ZIP...' : 'Download Extension (.zip)'}</span>
          </button>
        </div>

        {/* 4-Step Quick Install Guide */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="bg-[#020617] p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1">
            <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Step 1</span>
            <p className="font-bold text-white">Click Download Zip</p>
            <p className="text-[11px] text-slate-400">Save and unzip <code className="text-indigo-300">gemini-extension.zip</code> on your computer.</p>
          </div>

          <div className="bg-[#020617] p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1">
            <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Step 2</span>
            <p className="font-bold text-white">Open chrome://extensions</p>
            <p className="text-[11px] text-slate-400">Navigate to Extensions page in Google Chrome browser.</p>
          </div>

          <div className="bg-[#020617] p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1">
            <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Step 3</span>
            <p className="font-bold text-white">Turn on Developer Mode</p>
            <p className="text-[11px] text-slate-400">Enable "Developer mode" toggle switch in top right corner.</p>
          </div>

          <div className="bg-[#020617] p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1">
            <span className="font-mono text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Step 4</span>
            <p className="font-bold text-white">Load Unpacked</p>
            <p className="text-[11px] text-slate-400">Click "Load unpacked" and select the unzipped extension directory!</p>
          </div>
        </div>
      </div>

      {/* Code Browser */}
      <div className="bg-[#0f172a]/95 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* File Tabs */}
        <div className="bg-[#020617] px-5 py-3 border-b border-slate-800 flex items-center justify-between gap-3 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-2">
            {CHROME_EXTENSION_FILES.map((file) => (
              <button
                key={file.filename}
                onClick={() => setSelectedFilename(file.filename)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center gap-1.5 ${
                  selectedFilename === file.filename
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file.filename}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleCopyCode}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy File'}</span>
          </button>
        </div>

        {/* File Description */}
        <div className="bg-[#020617]/50 px-5 py-2.5 border-b border-slate-800 text-xs text-slate-400 flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <span>{currentFile.description}</span>
        </div>

        {/* Code Content View */}
        <div className="p-5 bg-[#020617] overflow-x-auto max-h-[480px] custom-scrollbar">
          <pre className="font-mono text-xs text-indigo-100/90 leading-relaxed">
            {currentFile.content}
          </pre>
        </div>

      </div>

    </div>
  );
};
