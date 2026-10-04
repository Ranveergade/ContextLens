/* Layout: DocumentsView component - Document upload zone & uploaded documents table matching skills.md */
import React from 'react';
import { UploadZone } from '../UploadZone';
import { ProcessingState } from '../ProcessingState';
import { DocumentItem } from '../../types';
import { FileText, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface DocumentsViewProps {
  documents: DocumentItem[];
  currentDocument: DocumentItem | null;
  onFileUpload: (file: File) => void;
  onTrySample: () => void;
  onSelectDocument: (docId: string) => void;
  isAnalyzing: boolean;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  currentDocument,
  onFileUpload,
  onTrySample,
  onSelectDocument,
  isAnalyzing
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Document Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">Upload, manage, and inspect project specification files.</p>
        </div>
      </div>

      {isAnalyzing ? (
        <ProcessingState filename={currentDocument?.filename || 'Document'} step="analyzing" />
      ) : (
        <UploadZone onFileUpload={onFileUpload} onTrySample={onTrySample} isLoading={isAnalyzing} />
      )}

      {/* Document History List */}
      <div className="p-6 rounded-xl glass-card border border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Uploaded Documents ({documents.length})</h3>

        {documents.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No documents uploaded yet. Upload a file above to begin.
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => {
              const isSelected = currentDocument?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => onSelectDocument(doc.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                      {doc.file_type}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{doc.filename}</h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
