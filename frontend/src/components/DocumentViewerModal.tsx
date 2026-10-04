import React, { useState, useEffect, useRef } from 'react';
import { X, FileText, ExternalLink, ShieldCheck, Search, Eye, FileCode } from 'lucide-react';
import { DocumentItem } from '../types';
import { api } from '../services/api';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
  highlightText?: string;
  pageNumber?: number;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  document,
  highlightText,
  pageNumber
}) => {
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'text' | 'file'>('text');
  const [loading, setLoading] = useState(false);
  const highlightRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isOpen && document) {
      setLoading(true);
      // Fetch clean extracted text from API
      api.getDocumentText(document.id)
        .then((res) => {
          setFileContent(res.full_text);
          setLoading(false);
        })
        .catch(() => {
          // Fallback to file stream if text extraction API fails
          fetch(api.getDocumentFileUrl(document.id))
            .then(res => res.text())
            .then(text => {
              setFileContent(text);
              setLoading(false);
            })
            .catch(() => {
              setFileContent('Failed to load document content.');
              setLoading(false);
            });
        });
    }
  }, [isOpen, document]);

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [fileContent, highlightText, viewMode]);

  if (!isOpen || !document) return null;

  const fileUrl = api.getDocumentFileUrl(document.id);

  const renderHighlightedContent = () => {
    if (!fileContent) return null;
    if (!highlightText || !highlightText.trim()) {
      return <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-200">{fileContent}</pre>;
    }

    const cleanHighlight = highlightText.trim();
    const lowerContent = fileContent.toLowerCase();
    const lowerMatch = cleanHighlight.toLowerCase();

    const matchIdx = lowerContent.indexOf(lowerMatch);

    if (matchIdx === -1) {
      // Fallback matching logic: find longest matching sentence or word chunk
      const words = cleanHighlight.split(/\s+/).filter(w => w.length > 3);
      if (words.length > 0) {
        const shortSnippet = words.slice(0, 4).join(' ').toLowerCase();
        const shortIdx = lowerContent.indexOf(shortSnippet);
        if (shortIdx !== -1) {
          const before = fileContent.slice(0, shortIdx);
          const matched = fileContent.slice(shortIdx, shortIdx + cleanHighlight.length + 20);
          const after = fileContent.slice(shortIdx + cleanHighlight.length + 20);
          return (
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-200">
              {before}
              <mark
                ref={highlightRef}
                className="bg-amber-400/30 text-amber-100 border border-amber-400/80 ring-4 ring-amber-400/20 font-bold px-1.5 py-0.5 rounded shadow-xl animate-pulse"
              >
                {matched}
              </mark>
              {after}
            </pre>
          );
        }
      }
      return <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-200">{fileContent}</pre>;
    }

    const before = fileContent.slice(0, matchIdx);
    const matched = fileContent.slice(matchIdx, matchIdx + cleanHighlight.length);
    const after = fileContent.slice(matchIdx + cleanHighlight.length);

    return (
      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-200">
        {before}
        <mark
          ref={highlightRef}
          className="bg-amber-400/30 text-amber-100 border border-amber-400/80 ring-4 ring-amber-400/20 font-bold px-1.5 py-0.5 rounded shadow-xl animate-pulse"
        >
          {matched}
        </mark>
        {after}
      </pre>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-4xl h-[85vh] glass-panel p-6 rounded-2xl border border-indigo-500/40 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">
                  {document.filename}
                </h3>
                {pageNumber && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    Page {pageNumber}
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Document Traceability Inspection Mode
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('text')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-all ${
                  viewMode === 'text'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Text & Highlight</span>
              </button>

              <button
                onClick={() => setViewMode('file')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-all ${
                  viewMode === 'file'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>PDF / File Stream</span>
              </button>
            </div>

            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 text-xs font-semibold flex items-center gap-1"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Highlight Alert Banner */}
        {highlightText && viewMode === 'text' && (
          <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Verbatim Evidence Highlighted: <strong>"{highlightText.slice(0, 65)}..."</strong>
              </span>
            </div>
            <span className="text-[10px] font-mono uppercase bg-amber-500/20 px-2 py-0.5 rounded text-amber-200">
              Auto-Scrolled
            </span>
          </div>
        )}

        {/* Document Viewer Content */}
        <div className="flex-1 overflow-auto py-4 font-mono text-xs text-slate-200 bg-slate-950/90 p-5 rounded-xl border border-slate-800 my-3">
          {loading ? (
            <div className="flex items-center justify-center h-full text-slate-400 space-x-2">
              <Search className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Loading document text & locating evidence passage...</span>
            </div>
          ) : viewMode === 'text' ? (
            renderHighlightedContent()
          ) : (
            <iframe
              src={fileUrl}
              className="w-full h-full rounded-lg border-0 bg-slate-900"
              title="PDF / Original File Stream"
            />
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-lg"
          >
            Close Document Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
