/* Layout: TimelineView component - Chronological vertical timeline matching skills.md */
import React from 'react';
import { DocumentItem, Analysis, SourceReference } from '../../types';
import { Calendar, ShieldCheck, Clock } from 'lucide-react';

interface TimelineViewProps {
  document: DocumentItem | null;
  analysis: Analysis | null;
  onProveIt: (title: string, type: 'Requirement' | 'Action Item' | 'Risk' | 'Question', ref?: SourceReference) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  document,
  analysis,
  onProveIt
}) => {
  if (!analysis) {
    return (
      <div className="text-center py-16 p-8 glass-card border border-slate-200">
        <p className="text-xs text-slate-500">No document timeline available. Please upload a file.</p>
      </div>
    );
  }

  const deadlineActions = analysis.action_items.filter(a => a.deadline);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 uppercase">
            <Calendar className="w-4 h-4" />
            <span>Document Schedule</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Timeline & Explicit Deadlines
          </h1>
        </div>
      </div>

      <div className="p-6 rounded-xl glass-card border border-slate-200 bg-white">
        <div className="relative border-l-2 border-blue-200 ml-4 space-y-6 py-2">
          {deadlineActions.length > 0 ? (
            deadlineActions.map((item, idx) => (
              <div key={idx} className="relative pl-6">
                <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                </div>
                <div className="text-xs font-mono font-bold text-blue-600 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.deadline}</span>
                </div>
                <div className="text-sm font-bold text-slate-900 mt-1">{item.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{item.description}</div>

                <div className="mt-2">
                  <button
                    onClick={() => onProveIt(item.title, 'Action Item', item.source_reference)}
                    className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-600 text-[11px] font-semibold flex items-center gap-1 border border-blue-200 cursor-pointer"
                  >
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    <span>PROVE IT</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="pl-6 text-xs text-slate-500">
              No explicit calendar deadlines were flagged in this document version.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
