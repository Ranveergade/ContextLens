// Premium: spring scale-in modal, staggered line fade-in, highlight expand animation,
//          pulse-glow on mark, floating back button, smooth scroll to highlight
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, FileText, ExternalLink, ShieldCheck, Search,
  Eye, FileCode, ArrowLeft, Loader2
} from 'lucide-react';
import { DocumentItem } from '../types';
import { api } from '../services/api';
import { prefersReducedMotion } from '../lib/utils';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
  highlightText?: string;
  pageNumber?: number;
}

const shouldAnimate = !prefersReducedMotion();

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
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && document) {
      setLoading(true);
      api.getDocumentText(document.id)
        .then((res) => {
          setFileContent(res.full_text);
          setLoading(false);
        })
        .catch(() => {
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
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [fileContent, highlightText, viewMode]);

  useEffect(() => {
    if (!isOpen) return;
    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && window.document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && window.document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.document.addEventListener('keydown', handleKeyDown);
    return () => window.document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const fileUrl = document ? api.getDocumentFileUrl(document.id) : '';

  const renderHighlightedContent = () => {
    if (!fileContent) return null;

    const lines = fileContent.split('\n');
    const maxStagger = Math.min(lines.length, 50);

    if (!highlightText || !highlightText.trim()) {
      return (
        <div className="font-sans text-sm text-slate-700 leading-relaxed" style={{ lineHeight: 1.75 }}>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={shouldAnimate ? { opacity: 0, x: -4 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i, maxStagger) * 0.012, duration: 0.25 }}
              className="min-h-[1.5em]"
            >
              {line || '\u00A0'}
            </motion.div>
          ))}
        </div>
      );
    }

    const cleanHighlight = highlightText.trim();
    const lowerContent = fileContent.toLowerCase();
    const lowerMatch = cleanHighlight.toLowerCase();
    let matchIdx = lowerContent.indexOf(lowerMatch);
    let matchLen = cleanHighlight.length;

    if (matchIdx === -1) {
      const words = cleanHighlight.split(/\s+/).filter(w => w.length > 3);
      if (words.length > 0) {
        const shortSnippet = words.slice(0, 4).join(' ').toLowerCase();
        const shortIdx = lowerContent.indexOf(shortSnippet);
        if (shortIdx !== -1) {
          matchIdx = shortIdx;
          matchLen = cleanHighlight.length + 20;
        }
      }
    }

    if (matchIdx === -1) {
      return (
        <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed" style={{ lineHeight: 1.75 }}>
          {fileContent}
        </pre>
      );
    }

    const before = fileContent.slice(0, matchIdx);
    const matched = fileContent.slice(matchIdx, matchIdx + matchLen);
    const after = fileContent.slice(matchIdx + matchLen);

    return (
      <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed" style={{ lineHeight: 1.75 }}>
        {before}
        <motion.mark
          ref={highlightRef}
          className="highlight-glow inline relative"
          initial={shouldAnimate ? { backgroundColor: 'rgba(254,240,138,0)' } : false}
          animate={{ backgroundColor: 'rgba(254,240,138,1)' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          aria-label="Highlighted evidence passage"
        >
          {matched}
        </motion.mark>
        {after}
      </pre>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && document && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="doc-viewer-title"
          id="doc-viewer-backdrop"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-md"
            aria-hidden="true"
          />

          <motion.div
            ref={modalRef}
            initial={shouldAnimate ? { opacity: 0, scale: 0.93, y: 24 } : false}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            className="relative z-10 w-full max-w-4xl h-[95vh] sm:h-[88vh] bg-gradient-to-b from-white to-[#FAFCFF] p-4 sm:p-6 rounded-3xl flex flex-col"
            style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05), 0 40px 100px rgba(0,0,0,0.20)' }}
            onClick={(e) => e.stopPropagation()}
            id="doc-viewer-content"
          >
            {/* Top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl"
              style={{ background: 'linear-gradient(90deg, #3B82F6, #60A5FA, #DBEAFE)' }}
              aria-hidden="true"
            />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]/60 gap-2 flex-wrap mt-2">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[#DBEAFE] flex items-center justify-center text-[#3B82F6] shrink-0">
                  <FileText className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap gap-1">
                    <h3 id="doc-viewer-title" className="text-sm font-bold text-slate-900 truncate">
                      {document.filename}
                    </h3>
                    {pageNumber && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#DBEAFE] text-[#3B82F6]">
                        Page {pageNumber}
                      </span>
                    )}
                    {highlightText && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]/60">
                        Evidence Highlighted
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">Document Traceability Inspection Mode</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* View mode toggle */}
                <div className="flex items-center bg-[#F8FAFC] p-1 rounded-xl border border-[#E2E8F0]/60 text-xs">
                  <button
                    onClick={() => setViewMode('text')}
                    className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                      viewMode === 'text'
                        ? 'bg-[#3B82F6] text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    id="doc-viewer-text-mode"
                    aria-pressed={viewMode === 'text'}
                  >
                    <FileCode className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">Text &amp; Highlight</span>
                  </button>
                  <button
                    onClick={() => setViewMode('file')}
                    className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                      viewMode === 'file'
                        ? 'bg-[#3B82F6] text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                    id="doc-viewer-file-mode"
                    aria-pressed={viewMode === 'file'}
                  >
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="hidden sm:inline">PDF / File Stream</span>
                  </button>
                </div>

                {/* Open external */}
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open document in new tab"
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-[#F1F5F9] transition-colors"
                  id="doc-viewer-external-link"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                {/* Close */}
                <motion.button
                  ref={closeBtnRef}
                  onClick={onClose}
                  aria-label="Close document viewer"
                  whileHover={shouldAnimate ? { scale: 1.1, rotate: 90 } : {}}
                  whileTap={shouldAnimate ? { scale: 0.9 } : {}}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                  className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-[#F1F5F9] transition-colors"
                  id="doc-viewer-close-btn"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Highlight banner */}
            <AnimatePresence>
              {highlightText && viewMode === 'text' && (
                <motion.div
                  initial={shouldAnimate ? { opacity: 0, y: -10, scale: 0.97 } : false}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="mt-3 p-3 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A]/80 text-[#92400E] text-xs flex items-center justify-between gap-2 flex-wrap"
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" aria-hidden="true" />
                    <span className="truncate">
                      Verbatim Evidence: <strong>"{highlightText.slice(0, 55)}..."</strong>
                    </span>
                  </div>
                  <span className="text-[10px] font-mono uppercase font-bold bg-[#FEF08A] px-2 py-0.5 rounded-lg text-[#854D0E] shrink-0">
                    Auto-Scrolled
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Document content area */}
            <div
              ref={contentRef}
              className="flex-1 overflow-auto py-5 px-5 bg-white/70 rounded-2xl border border-[#E2E8F0]/40 my-3"
              style={{ boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)' }}
            >
              <div className="max-w-[720px] mx-auto">
                {loading ? (
                  <motion.div
                    initial={shouldAnimate ? { opacity: 0 } : false}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-40 gap-3 text-slate-400"
                  >
                    <motion.div
                      animate={shouldAnimate ? { rotate: 360 } : {}}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Loader2 className="w-5 h-5 text-[#3B82F6]" aria-hidden="true" />
                    </motion.div>
                    <span className="text-sm">Loading document &amp; locating evidence passage...</span>
                  </motion.div>
                ) : viewMode === 'text' ? (
                  renderHighlightedContent()
                ) : (
                  <iframe
                    src={fileUrl}
                    className="w-full h-[60vh] rounded-xl border-0 bg-white"
                    title="PDF / Original File Stream"
                  />
                )}
              </div>
            </div>

            {/* Floating back-to-dashboard button */}
            <motion.button
              onClick={onClose}
              initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 300, damping: 30 }}
              whileHover={shouldAnimate ? { scale: 1.04, y: -2 } : {}}
              whileTap={shouldAnimate ? { scale: 0.97 } : {}}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 btn-primary px-5 py-2.5 text-xs flex items-center gap-2 z-20"
              style={{ boxShadow: '0 4px 20px rgba(59,130,246,0.35), 0 2px 8px rgba(0,0,0,0.10)' }}
              id="doc-viewer-back-btn"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              Back to Dashboard
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
