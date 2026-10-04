import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, FileSpreadsheet, AlertCircle, Sparkles } from 'lucide-react';

interface UploadZoneProps {
  onFileUpload: (file: File) => void;
  onTrySample: () => void;
  isLoading: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  onFileUpload,
  onTrySample,
  isLoading
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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
    <div className="max-w-2xl mx-auto px-4 my-6">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer p-8 sm:p-12 rounded-2xl border-2 border-dashed transition-all text-center glass-panel ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-950/20 glow-indigo'
            : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.txt,.xlsx,.xls"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
          <UploadCloud className="w-8 h-8" />
        </div>

        <h2 className="text-lg font-bold text-white mb-2">
          Drop your document here or <span className="text-indigo-400 underline decoration-indigo-500/40 underline-offset-4">browse</span>
        </h2>

        <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto">
          Upload project specifications, PDFs, requirements spreadsheets, images, or specs up to 25MB.
        </p>

        {/* Supported Formats */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-800 text-[11px] font-mono flex items-center gap-1">
            <FileText className="w-3 h-3 text-red-400" /> PDF
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-800 text-[11px] font-mono flex items-center gap-1">
            <FileSpreadsheet className="w-3 h-3 text-emerald-400" /> Excel (XLSX / XLS)
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-800 text-[11px] font-mono flex items-center gap-1">
            <ImageIcon className="w-3 h-3 text-blue-400" /> PNG / JPG
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-900 text-slate-300 border border-slate-800 text-[11px] font-mono flex items-center gap-1">
            <FileText className="w-3 h-3 text-cyan-400" /> TXT
          </span>
        </div>

        {/* Quick Sample Button inside card */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onTrySample();
          }}
          disabled={isLoading}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-all shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Load Hackathon Sample Specification</span>
        </button>
      </div>

      {errorMsg && (
        <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
