// Premium: spring scale-in modal, shimmer PROVE IT badge, growing blue border,
//          arrow slide on CTA hover, AnimatePresence exit, Escape close
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, FileText, CheckCircle2, Copy, Check, Search, ArrowRight } from 'lucide-react';
import { SourceReference } from '../types';
import { prefersReducedMotion } from '../lib/utils';

interface EvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemTitle: string;
  itemType: 'Requirement' | 'Action Item' | 'Risk' | 'Question';
  evidence: SourceReference | null;
  documentFilename: string;
  onHighlightInFile: (text: string, page?: number) => void;
}

const shouldAnimate = !prefersReducedMotion();

const typeColors: Record<string, { bg: string; text: string; border: string }> = {
  'Requirement': { bg: '#DBEAFE', text: '#1D4ED8', border: '#93C5FD' },
  'Action Item': { bg: '#ECFDF5', text: '#047857', border: '#6EE7B7' },
  'Risk': { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' },
  'Question': { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
};

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
  const [pulsing, setPulsing] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const typeStyle = typeColors[itemType] || typeColors['Action Item'];

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
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopy = () => {
    if (evidence?.text) {
      navigator.clipboard.writeText(evidence.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleOpenHighlight = () => {
    if (evidence?.text) {
      setPulsing(true);
      setTimeout(() => {
        onClose();
        onHighlightInFile(evidence.text, evidence.page);
        setPulsing(false);
      }, 220);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="evidence-modal-title"
          id="evidence-modal-backdrop"
        >
          {/* Backdrop blur */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
            aria-hidden="true"
          />

          <motion.div
            ref={modalRef}
            initial={shouldAnimate ? { opacity: 0, scale: 0.92, y: 24 } : false}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative z-10 w-full max-w-2xl bg-white p-6 sm:p-8 rounded-3xl max-h-[90vh] overflow-y-auto"
            style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.05), 0 32px 80px rgba(0,0,0,0.18)' }}
            onClick={(e) => e.stopPropagation()}
            id="evidence-modal-content"
          >
            {/* Subtle top gradient */}
            <div
              className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
              style={{ background: 'linear-gradient(90deg, #10B981, #3B82F6, #60A5FA)' }}
              aria-hidden="true"
            />

            {/* Header */}
            <div className="flex items-start justify-between pb-5 border-b border-[#E2E8F0]/60 mt-2">
              <div className="flex items-start space-x-3 flex-1 min-w-0">
                <motion.div
                  initial={shouldAnimate ? { scale: 0, rotate: -20 } : false}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 350, damping: 20 }}
                  className="w-11 h-11 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0]/60 flex items-center justify-center text-[#10B981] shrink-0"
                >
                  <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                </motion.div>
                <div className="min-w-0">
                  <div className="flex items-center flex-wrap gap-1.5 mb-1">
                    {/* PROVE IT shimmer badge */}
                    <motion.span
                      className="badge-evidence relative overflow-hidden"
                      animate={shouldAnimate ? { boxShadow: ['0 0 0 0 rgba(16,185,129,0.3)', '0 0 0 4px rgba(16,185,129,0)', '0 0 0 0 rgba(16,185,129,0.3)'] } : {}}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      aria-label="Proven with source evidence"
                    >
                      <span className="absolute inset-0 animate-shimmer opacity-40" aria-hidden="true" />
                      <ShieldCheck className="w-3 h-3 relative" aria-hidden="true" />
                      <span className="relative font-mono tracking-widest">PROVE IT</span>
                    </motion.span>
                    {/* Type badge */}
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        background: typeStyle.bg,
                        color: typeStyle.text,
                        border: `1px solid ${typeStyle.border}`,
                      }}
                    >
                      {itemType}
                    </span>
                  </div>
                  <h3
                    id="evidence-modal-title"
                    className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug"
                  >
                    {itemTitle}
                  </h3>
                </div>
              </div>

              <motion.button
                ref={closeBtnRef}
                onClick={onClose}
                aria-label="Close evidence modal"
                whileHover={shouldAnimate ? { scale: 1.1, rotate: 90 } : {}}
                whileTap={shouldAnimate ? { scale: 0.9 } : {}}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                className="p-2 text-slate-400 hover:text-slate-900 rounded-xl hover:bg-[#F1F5F9] transition-colors ml-3 shrink-0"
                id="evidence-modal-close"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Body */}
            <div className="py-5 space-y-4">
              {/* Source metadata */}
              <motion.div
                initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]/50"
              >
                <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium">
                  <FileText className="w-4 h-4 text-[#3B82F6]" aria-hidden="true" />
                  <span>
                    Document: <strong className="text-slate-900 font-mono">{documentFilename}</strong>
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-full bg-[#DBEAFE] text-[#3B82F6] font-mono font-bold text-[11px]">
                    Page {evidence?.page ?? 1}
                  </span>
                  <span className="badge-evidence">
                    <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                    Verbatim Citation
                  </span>
                </div>
              </motion.div>

              {/* Evidence quote block */}
              <motion.div
                initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="relative p-5 rounded-2xl bg-white border border-[#E2E8F0]/50"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Extracted Source Passage
                  </span>
                  <motion.button
                    onClick={handleCopy}
                    aria-label={copied ? 'Copied to clipboard' : 'Copy evidence text'}
                    whileHover={shouldAnimate ? { scale: 1.04 } : {}}
                    whileTap={shouldAnimate ? { scale: 0.96 } : {}}
                    className={`flex items-center space-x-1.5 text-xs font-semibold transition-colors ${
                      copied ? 'text-[#10B981]' : 'text-[#3B82F6] hover:text-[#2563EB]'
                    }`}
                    id="evidence-copy-btn"
                  >
                    <AnimatePresence mode="wait">
                      {copied ? (
                        <motion.div
                          key="check"
                          initial={shouldAnimate ? { scale: 0 } : false}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        >
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                        </motion.div>
                      ) : (
                        <motion.div key="copy" initial={false} animate={{ scale: 1 }}>
                          <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </motion.button>
                </div>

                {/* Quote with animated left border */}
                <div className="relative overflow-hidden rounded-xl">
                  <motion.div
                    initial={shouldAnimate ? { scaleY: 0 } : false}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
                    className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#3B82F6] to-[#60A5FA] origin-top rounded-full"
                    aria-hidden="true"
                  />
                  <blockquote
                    className="text-sm sm:text-base text-slate-700 italic leading-relaxed bg-[#F8FAFC] p-4 pl-6 border-l-4 border-transparent"
                    style={{ quotes: '"\\201C""\\201D"' }}
                  >
                    "{evidence?.text || 'Source evidence passage text is cited directly from the uploaded document.'}"
                  </blockquote>
                </div>
              </motion.div>

              {/* Highlight CTA */}
              <motion.button
                onClick={handleOpenHighlight}
                animate={shouldAnimate && pulsing ? { scale: [1, 1.04, 1] } : {}}
                whileHover={shouldAnimate ? { scale: 1.02, y: -1 } : {}}
                whileTap={shouldAnimate ? { scale: 0.98 } : {}}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="btn-primary w-full py-3.5 text-xs font-bold flex items-center justify-center space-x-2 uppercase tracking-widest group"
                id="evidence-highlight-btn"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                <span>Highlight Passage in Original File</span>
                <motion.div
                  animate={shouldAnimate ? { x: [0, 4, 0] } : {}}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </motion.div>
              </motion.button>

              {/* Trust indicator */}
              <motion.div
                initial={shouldAnimate ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="p-3.5 rounded-2xl bg-[#F8FAFC] text-[11px] text-slate-500 border border-[#E2E8F0]/50 flex items-start space-x-2.5"
              >
                <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  This evidence passage was extracted by <strong className="text-slate-700">Gemma 4</strong> directly from
                  page <strong className="text-[#3B82F6] font-mono">{evidence?.page ?? 1}</strong> of the uploaded file without synthetic modification.
                </span>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-[#E2E8F0]/60 flex justify-end">
              <motion.button
                onClick={onClose}
                whileHover={shouldAnimate ? { scale: 1.02 } : {}}
                whileTap={shouldAnimate ? { scale: 0.98 } : {}}
                className="btn-primary px-5 py-2.5 text-xs"
                id="evidence-modal-close-footer"
              >
                Close Evidence Inspector
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
