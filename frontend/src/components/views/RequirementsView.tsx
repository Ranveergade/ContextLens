/* Layout: RequirementsView component - Filtered list of extracted document requirements with PROVE IT button matching skills.md */
import React from 'react';
import { DocumentItem, Analysis, SourceReference } from '../../types';
import { ListChecks, ShieldCheck } from 'lucide-react';

interface RequirementsViewProps {
  document: DocumentItem | null;
  analysis: Analysis | null;
  onProveIt: (title: string, type: 'Requirement' | 'Action Item' | 'Risk' | 'Question', ref?: SourceReference) => void;
}

export const RequirementsView: React.FC<RequirementsViewProps> = ({
  document,
  analysis,
  onProveIt
}) => {
  if (!analysis) {
    return (
      <div className="text-center py-16 p-8 glass-card border border-slate-200">
        <p className="text-xs text-slate-500">No document requirements available. Please upload a file.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 uppercase">
            <ListChecks className="w-4 h-4" />
            <span>Document Requirements</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Structural & System Requirements ({analysis.requirements.length})
          </h1>
        </div>
      </div>

      <div className="space-y-3">
        {analysis.requirements.map((req) => (
          <div
            key={req.id}
            className="p-5 rounded-xl glass-card border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">{req.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{req.description}</p>
            </div>

            <button
              onClick={() => onProveIt(req.title, 'Requirement', req.source_reference)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 text-xs font-semibold flex items-center space-x-1.5 shrink-0 self-start sm:self-center cursor-pointer shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>PROVE IT</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
