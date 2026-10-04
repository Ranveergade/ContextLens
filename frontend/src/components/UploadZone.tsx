// Premium: floating icon with spring float, drag-over radial glow + scale,
//          animated dashed border, success checkmark spring-in, error dismiss
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UploadCloud, FileText, Image as ImageIcon, FileSpreadsheet,
  AlertCircle, Sparkles, CheckCircle2, X
} from 'lucide-react';
import { prefersReducedMotion } from '../lib/utils';

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
  onTrySample: () => void;
  isLoading: boolean;
}

const shouldAnimate = !prefersReducedMotion();

const fileFormats = [
  { icon: FileText, label: 'PDF', color: 'text-[#EF4444]', bg: 'bg-[#FEF2F2]', border: 'border-[#FECACA]/60' },
  { icon: FileSpreadsheet, label: 'Excel', color: 'text-[#10B981]', bg: 'bg-[#ECFDF5]', border: 'border-[#A7F3D0]/60' },
  { icon: ImageIcon, label: 'PNG / JPG', color: 'text-[#3B82F6]', bg: 'bg-[#DBEAFE]', border: 'border-[#93C5FD]/60' },
  { icon: FileText, label: 'TXT', color: 'text-slate-500', bg: 'bg-[#F1F5F9]', border: 'border-[#E2E8F0]/60' },
];

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFileUpload,
  onTrySample,
  isLoading
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [justSelected, setJustSelected] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setErrorMsg(null);
    const validExts = ['.pdf', '.png', '.jpg', '.jpeg', '.txt', '.xlsx', '.xls'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validExts.includes(ext)) {
      setErrorMsg(`Unsupported file type '${ext}'. Please upload a PDF, PNG, JPG, TXT, or Excel (.xlsx, .xls) file.`);
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('File size exceeds maximum 25MB limit.');
      return;
    }

    setJustSelected(true);
    setTimeout(() => setJustSelected(false), 800);
    onFileUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 my-6 pb-24">
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Upload document by drag and drop or click to browse"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
        animate={shouldAnimate ? {
          scale: isDragOver ? 1.025 : 1,
        } : {}}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
        whileHover={shouldAnimate && !isDragOver ? { scale: 1.012 } : {}}
        className={`relative cursor-pointer p-10 sm:p-14 rounded-3xl border-2 text-center overflow-hidden select-none transition-colors duration-200 ${
          isDragOver
            ? 'border-[#3B82F6] bg-[#EFF6FF]/80'
            : justSelected
              ? 'border-[#10B981] bg-[#ECFDF5]/60'
              : 'border-dashed border-[#CBD5E1] bg-white/75 backdrop-blur-xl hover:border-[#3B82F6]/70 hover:bg-[#EFF6FF]/40'
        }`}
        style={{
          boxShadow: isDragOver
            ? '0 0 0 4px rgba(59,130,246,0.18), 0 24px 60px rgba(59,130,246,0.14)'
            : justSelected
              ? '0 0 0 3px rgba(16,185,129,0.2), 0 20px 50px rgba(16,185,129,0.10)'
              : '0 1px 3px rgba(0,0,0,0.04), 0 12px 48px rgba(59,130,246,0.06)',
          transition: 'box-shadow 0.2s ease, background 0.2s ease',
        }}
        id="upload-drop-zone"
      >
        {/* Radial glow overlay — drag / hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-3xl"
          animate={shouldAnimate ? {
            opacity: isDragOver ? 1 : 0,
          } : {}}
          transition={{ duration: 0.3 }}
          style={{
            background: 'radial-gradient(circle at 50% 45%, rgba(59,130,246,0.18), transparent 65%)',
          }}
          aria-hidden="true"
        />

        {/* Drag-over animated dashed border effect */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{
                background: 'repeating-linear-gradient(90deg, #3B82F6 0, #3B82F6 8px, transparent 8px, transparent 20px)',
                backgroundSize: '28px 2px',
                backgroundPosition: '0 0, 0 100%, 0 0, 100% 0',
                backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
              }}
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.txt,.xlsx,.xls"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
          aria-hidden="true"
          disabled={isLoading}
        />

        {/* Icon — floats, bounces on drag, checks on success */}
        <motion.div
          animate={shouldAnimate ? (
            justSelected
              ? { scale: [1, 1.25, 0.95, 1] }
              : isDragOver
                ? { y: [0, -10, 0, -6, 0], scale: 1.12 }
                : { y: [0, -5, 0] }
          ) : {}}
          transition={
            justSelected
              ? { duration: 0.5, ease: 'backOut' }
              : isDragOver
                ? { duration: 0.7, repeat: Infinity }
                : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
          }
          className={`relative w-18 h-18 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm ${
            justSelected
              ? 'bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5]'
              : isDragOver
                ? 'bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE]'
                : 'bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]'
          }`}
          style={{ width: 72, height: 72 }}
        >
          <AnimatePresence mode="wait">
            {justSelected ? (
              <motion.div
                key="check"
                initial={{ scale: 0, opacity: 0, rotate: -20 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <CheckCircle2 className="w-9 h-9 text-[#10B981]" aria-hidden="true" />
              </motion.div>
            ) : (
              <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <UploadCloud
                  className={`w-9 h-9 ${isDragOver ? 'text-[#2563EB]' : 'text-[#3B82F6]'}`}
                  aria-hidden="true"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Text */}
        <AnimatePresence mode="wait">
          {justSelected ? (
            <motion.div
              key="selected"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-lg font-bold text-[#10B981] mb-1">File Selected!</h2>
              <p className="text-xs text-slate-400">Processing will begin shortly...</p>
            </motion.div>
          ) : isDragOver ? (
            <motion.div
              key="dragover"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-lg font-bold text-[#2563EB] mb-1">Release to Upload</h2>
              <p className="text-xs text-[#3B82F6]">Drop your file here</p>
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-lg font-semibold text-slate-700 mb-1.5">
                Drag &amp; drop or click to upload
              </h2>
              <p className="text-xs text-slate-400 mb-5 max-w-xs mx-auto leading-relaxed">
                PDF, PNG, JPG, TXT, Excel (.xlsx, .xls) — up to 25MB
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Format badges */}
        {!justSelected && !isDragOver && (
          <motion.div
            initial={shouldAnimate ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-5 relative z-10"
          >
            {fileFormats.map(({ icon: Icon, label, color, bg, border }) => (
              <span
                key={label}
                className={`px-2.5 py-1 rounded-lg ${bg} border ${border} text-slate-600 text-[11px] font-mono font-medium flex items-center gap-1.5`}
              >
                <Icon className={`w-3 h-3 ${color}`} aria-hidden="true" /> {label}
              </span>
            ))}
          </motion.div>
        )}

        {/* Sample button */}
        {!justSelected && !isDragOver && (
          <motion.button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTrySample();
            }}
            disabled={isLoading}
            whileHover={shouldAnimate ? { scale: 1.03, y: -1 } : {}}
            whileTap={shouldAnimate ? { scale: 0.97 } : {}}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#3B82F6] border border-[#DBEAFE]/90 text-xs font-semibold transition-colors relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
            id="upload-sample-btn"
          >
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Load Hackathon Sample Specification</span>
          </motion.button>
        )}
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="mt-4 p-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] text-[#DC2626] text-xs flex items-center justify-between gap-3"
            role="alert"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#EF4444]" aria-hidden="true" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              aria-label="Dismiss error"
              className="p-1 hover:bg-[#FECACA]/60 rounded-lg transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
