import React from 'react';
import { Layers, Sparkles, UploadCloud, CheckCircle2, FileText } from 'lucide-react';
import { DocumentItem } from '../types';

interface NavbarProps {
  documents: DocumentItem[];
  selectedDocId?: string;
  onSelectDoc: (docId: string) => void;
  onNewUpload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  documents,
  selectedDocId,
  onSelectDoc,
  onNewUpload
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewUpload}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                ContextLens
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Gemma 4
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Understand everything. Act on what matters.
            </p>
          </div>
        </div>

        {/* Center: Document Switcher if documents exist */}
        {documents.length > 0 && (
          <div className="hidden md:flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            <FileText className="w-4 h-4 text-slate-400 ml-2" />
            <select
              value={selectedDocId || ''}
              onChange={(e) => onSelectDoc(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none pr-8 py-1 cursor-pointer font-medium"
            >
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id} className="bg-slate-900 text-slate-200">
                  {doc.filename} ({doc.file_type})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Backend Online</span>
          </div>

          <button
            onClick={onNewUpload}
            className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>

      </div>
    </header>
  );
};
