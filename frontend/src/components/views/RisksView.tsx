/* Layout: RisksView component - Risk cards sorted by severity with PROVE IT buttons matching skills.md */
import React from 'react';
import { DocumentItem, Analysis, SourceReference } from '../../types';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

interface RisksViewProps {
  document: DocumentItem | null;
  analysis: Analysis | null;
  onProveIt: (title: string, type: 'Requirement' | 'Action Item' | 'Risk' | 'Question', ref?: SourceReference) => void;
}

export const RisksView: React.FC<RisksViewProps> = ({
  document,
  analysis,
  onProveIt
}) => {
  if (!analysis) {
    return (
      <div className="text-center py-16 p-8 glass-card border border-slate-200">
        <p className="text-xs text-slate-500">No risks flagged for this document.</p>
      </div>
    );
  }

  // Sort risks: high severity first, medium second
  const sortedRisks = [...analysis.risks].sort((a, b) => {
    if (a.severity === 'high' && b.severity !== 'high') return -1;
    if (a.severity !== 'high' && b.severity === 'high') return 1;
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-red-600 uppercase">
            <AlertTriangle className="w-4 h-4" />
            <span>Risk Assessment</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Risks & Ambiguities ({sortedRisks.length})
          </h1>
        </div>
      </div>

      <div className="space-y-3">
        {sortedRisks.map((risk) => (
          <div
            key={risk.id}
            className="p-5 rounded-xl glass-card border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle
                className={`w-5 h-5 shrink-0 mt-0.5 ${
                  risk.severity === 'high' ? 'text-red-500' : 'text-amber-500'
                }`}
              />
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      risk.severity === 'high'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-amber-50 text-amber-600 border border-amber-200'
                    }`}
                  >
                    {risk.severity} severity
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">{risk.description}</p>
              </div>
            </div>

            <button
              onClick={() => onProveIt('Risk Factor', 'Risk', risk.source_reference)}
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
