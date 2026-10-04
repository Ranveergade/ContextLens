/* Layout: ActionItemsView component - Checkbox task list with completion toggling & PROVE IT matching skills.md */
import React from 'react';
import { DocumentItem, Analysis, SourceReference } from '../../types';
import { CheckSquare, CheckCircle2, Circle, Clock, ShieldCheck } from 'lucide-react';

interface ActionItemsViewProps {
  document: DocumentItem | null;
  analysis: Analysis | null;
  onToggleAction: (actionId: string, completed: boolean) => void;
  onProveIt: (title: string, type: 'Requirement' | 'Action Item' | 'Risk' | 'Question', ref?: SourceReference) => void;
}

export const ActionItemsView: React.FC<ActionItemsViewProps> = ({
  document,
  analysis,
  onToggleAction,
  onProveIt
}) => {
  if (!analysis) {
    return (
      <div className="text-center py-16 p-8 glass-card border border-slate-200">
        <p className="text-xs text-slate-500">No action items available. Please upload a file.</p>
      </div>
    );
  }

  const completedCount = analysis.action_items.filter(a => a.completed).length;
  const totalCount = analysis.action_items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 uppercase">
            <CheckSquare className="w-4 h-4" />
            <span>Task Manager</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Action Items & Task Checklist ({completedCount}/{totalCount})
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-bold text-blue-600">{progressPercent}%</span>
        </div>
      </div>

      <div className="space-y-3">
        {analysis.action_items.map((act) => (
          <div
            key={act.id}
            className={`p-4 sm:p-5 rounded-xl glass-card border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              act.completed
                ? 'bg-slate-50/50 border-slate-200 opacity-80'
                : 'bg-white border-slate-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-start space-x-3">
              <button
                onClick={() => onToggleAction(act.id, !act.completed)}
                className="mt-0.5 text-blue-600 hover:text-blue-700 transition-colors shrink-0 cursor-pointer"
              >
                {act.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400 hover:text-blue-600" />
                )}
              </button>

              <div>
                <h4 className={`text-sm font-bold ${act.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                  {act.title}
                </h4>
                {act.description && (
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {act.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                    act.priority === 'high'
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-amber-50 text-amber-600 border border-amber-200'
                  }`}>
                    {act.priority} priority
                  </span>

                  {act.deadline && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-500" /> {act.deadline}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => onProveIt(act.title, 'Action Item', act.source_reference)}
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
