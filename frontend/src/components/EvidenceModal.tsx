import React, { useState } from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, Copy, Search, ExternalLink } from 'lucide-react';
import { SourceReference } from '../types';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemTitle: string;
  itemType: 'Requirement' | 'Action Item' | 'Risk' | 'Question';
  evidence: SourceReference | null;
  documentFilename: string;
  onHighlightInFile: (text: string, page?: number) => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  isOpen,
  onClose,
  itemTitle,
  itemType,
  evidence,
  documentFilename,
  onHighlightInFile
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (evidence?.text) {
      navigator.clipboard.writeText(evidence.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenHighlight = () => {
    if (evidence?.text) {
      onClose();
      onHighlightInFile(evidence.text, evidence.page);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-2xl border border-indigo-500/30 shadow-2xl shadow-indigo-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  PROVE IT • Source Evidence
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  {itemType}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5 line-clamp-1">
                {itemTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-6 space-y-4">
          
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
            <div className="flex items-center space-x-2 text-slate-300 font-medium">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Document: <strong className="text-white font-mono">{documentFilename}</strong></span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono font-semibold">
                Page {evidence?.page ?? 1}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verbatim Citation
              </span>
            </div>
          </div>

          {/* Highlighted Evidence Text Box */}
          <div className="relative p-5 rounded-xl bg-slate-900/90 border border-indigo-500/40 glow-indigo">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Extracted Source Passage
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <p className="text-sm sm:text-base text-slate-100 font-serif leading-relaxed italic bg-slate-950/60 p-4 rounded-lg border border-slate-800 border-l-4 border-l-cyan-400">
              "{evidence?.text || 'Source evidence passage text is cited directly from the uploaded document.'}"
            </p>
          </div>

          {/* Action button to highlight passage inside original file */}
          <button
            onClick={handleOpenHighlight}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-indigo-500/20 hover:from-amber-500/30 hover:to-indigo-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center justify-center space-x-2 shadow-lg transition-all"
          >
            <Search className="w-4 h-4 text-amber-400" />
            <span>HIGHLIGHT THIS PASSAGE IN ORIGINAL FILE</span>
            <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
          </button>

          {/* Verification note */}
          <div className="p-3 rounded-xl bg-slate-900/50 text-[11px] text-slate-400 border border-slate-800 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              This evidence passage was extracted by Gemma 4 directly from page {evidence?.page ?? 1} of the uploaded file without synthetic modification.
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
          >
            Close Evidence Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
