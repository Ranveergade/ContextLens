/* Layout: OverviewView component - Executive summary, key metrics cards, and hero overview matching skills.md */
import React from 'react';
import { Hero } from '../Hero';
import { DocumentItem, Analysis, SourceReference } from '../../types';
import { FileText, CheckSquare, AlertTriangle, HelpCircle, ShieldCheck } from 'lucide-react';

interface OverviewViewProps {
  document: DocumentItem | null;
  analysis: Analysis | null;
  onTrySample: () => void;
  onFileUpload: (file: File) => void;
  onProveIt: (title: string, type: 'Requirement' | 'Action Item' | 'Risk' | 'Question', ref?: SourceReference) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  document,
  analysis,
  onTrySample,
  onFileUpload,
  onProveIt
}) => {
  if (!document || !analysis) {
    return (
      <div className="space-y-6">
        <Hero onStartUpload={() => {}} onTrySample={onTrySample} />
      </div>
    );
  }

  const completedActions = analysis.action_items.filter(a => a.completed).length;
  const totalActions = analysis.action_items.length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Overview Header Banner */}
      <div className="glass-card p-6 border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Document Executive Overview
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              {document.filename}
            </h1>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
            {document.file_type} • Analyzed
          </span>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mt-4">
          {analysis.summary}
        </p>
      </div>

      {/* Key Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-xl glass-card border border-slate-200 bg-white">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div className="text-xs font-medium text-slate-500">Action Items</div>
          <div className="text-2xl font-bold text-slate-900 mt-0.5">
            {completedActions} <span className="text-xs text-slate-400 font-normal">/ {totalActions} done</span>
          </div>
        </div>

        <div className="p-5 rounded-xl glass-card border border-slate-200 bg-white">
          <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <div className="text-xs font-medium text-slate-500">Requirements</div>
          <div className="text-2xl font-bold text-slate-900 mt-0.5">
            {analysis.requirements.length}
          </div>
        </div>

        <div className="p-5 rounded-xl glass-card border border-slate-200 bg-white">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-600 mb-3">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="text-xs font-medium text-slate-500">Risks Flagged</div>
          <div className="text-2xl font-bold text-slate-900 mt-0.5">
            {analysis.risks.length}
          </div>
        </div>

        <div className="p-5 rounded-xl glass-card border border-slate-200 bg-white">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-3">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="text-xs font-medium text-slate-500">Open Questions</div>
          <div className="text-2xl font-bold text-slate-900 mt-0.5">
            {analysis.questions.length}
          </div>
        </div>

      </div>

      {/* Highlights / Priority Actions preview */}
      <div className="p-6 rounded-xl glass-card border border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 mb-4">High Priority Tasks & Verifiable Claims</h3>
        <div className="space-y-3">
          {analysis.action_items.slice(0, 4).map((action) => (
            <div key={action.id} className="p-3.5 rounded-lg bg-slate-50/70 border border-slate-200 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-800">{action.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{action.description}</p>
              </div>

              <button
                onClick={() => onProveIt(action.title, 'Action Item', action.source_reference)}
                className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1 border border-blue-200 shrink-0 ml-3"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>PROVE IT</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
