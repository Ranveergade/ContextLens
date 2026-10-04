import React, { useState } from 'react';
import { 
  CheckSquare, 
  FileText, 
  AlertTriangle, 
  HelpCircle, 
  Clock, 
  ShieldCheck, 
  ListChecks, 
  Calendar, 
  CheckCircle2, 
  Circle,
  ExternalLink
} from 'lucide-react';
import { DocumentItem, Analysis, ActionItem, Requirement, Risk, Question, SourceReference } from '../types';

interface AnalysisDashboardProps {
  document: DocumentItem;
  analysis: Analysis;
  onToggleAction: (actionId: string, completed: boolean) => void;
  onProveIt: (title: string, type: 'Requirement' | 'Action Item' | 'Risk' | 'Question', ref?: SourceReference) => void;
  onViewDocumentFile: () => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  document,
  analysis,
  onToggleAction,
  onProveIt,
  onViewDocumentFile
}) => {
  const [activeTab, setActiveTab] = useState<'actions' | 'requirements' | 'timeline' | 'risks' | 'questions'>('actions');

  const completedActionsCount = analysis.action_items.filter(a => a.completed).length;
  const totalActionsCount = analysis.action_items.length;
  const progressPercent = totalActionsCount > 0 ? Math.round((completedActionsCount / totalActionsCount) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Executive Summary Top Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-xs text-indigo-400 font-mono font-medium mb-1">
              <span>DOCUMENT WORKSPACE</span>
              <span>•</span>
              <span className="text-slate-400">{document.filename}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Executive AI Analysis
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onViewDocumentFile}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-2 transition-all shadow-md"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
              <span>View Source Document</span>
            </button>
          </div>
        </div>

        {/* Summary Text */}
        <div className="pt-6">
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {analysis.summary}
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Action Items</div>
              <div className="text-base font-bold text-white">{completedActionsCount} / {totalActionsCount}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Requirements</div>
              <div className="text-base font-bold text-white">{analysis.requirements.length}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Risks Flagged</div>
              <div className="text-base font-bold text-white">{analysis.risks.length}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Open Questions</div>
              <div className="text-base font-bold text-white">{analysis.questions.length}</div>
            </div>
          </div>

        </div>

      </div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-2 border-b border-slate-800 overflow-x-auto pb-1 scrollbar-none">
        
        <button
          onClick={() => setActiveTab('actions')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'actions'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <ListChecks className="w-4 h-4" />
          <span>Action Items ({analysis.action_items.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requirements')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'requirements'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Requirements ({analysis.requirements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'timeline'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Timeline & Deadlines</span>
        </button>

        <button
          onClick={() => setActiveTab('risks')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'risks'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Risks & Ambiguities ({analysis.risks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs font-semibold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'questions'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Questions & Missing Info ({analysis.questions.length})</span>
        </button>

      </div>

      {/* Tab Panels */}
      <div>
        
        {/* 1. ACTION ITEMS TAB */}
        {activeTab === 'actions' && (
          <div className="space-y-4">
            
            {/* Progress Header */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="text-xs font-bold text-slate-300">Completion Progress</div>
                <div className="w-48 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-cyan-400">{progressPercent}%</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {completedActionsCount} of {totalActionsCount} completed
              </span>
            </div>

            <div className="space-y-3">
              {analysis.action_items.map((act) => (
                <div
                  key={act.id}
                  className={`p-4 sm:p-5 rounded-xl glass-card border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    act.completed
                      ? 'bg-slate-950/40 border-slate-900 opacity-75'
                      : 'border-slate-800/80 hover:border-indigo-500/40'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => onToggleAction(act.id, !act.completed)}
                      className="mt-0.5 text-indigo-400 hover:text-indigo-300 transition-colors shrink-0"
                    >
                      {act.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-500 hover:text-indigo-400" />
                      )}
                    </button>

                    <div>
                      <h4 className={`text-sm font-bold ${act.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                        {act.title}
                      </h4>
                      {act.description && (
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {act.description}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                          act.priority === 'high'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                          {act.priority} priority
                        </span>

                        {act.deadline && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-400" /> {act.deadline}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* PROVE IT Button */}
                  <div className="flex items-center justify-end sm:shrink-0">
                    <button
                      onClick={() => onProveIt(act.title, 'Action Item', act.source_reference)}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-mono tracking-wide">PROVE IT</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* 2. REQUIREMENTS TAB */}
        {activeTab === 'requirements' && (
          <div className="space-y-3">
            {analysis.requirements.map((req) => (
              <div key={req.id} className="p-5 rounded-xl glass-card border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{req.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{req.description}</p>
                </div>

                <button
                  onClick={() => onProveIt(req.title, 'Requirement', req.source_reference)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center space-x-1.5 shrink-0 self-end sm:self-center"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono">PROVE IT</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 3. TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div className="p-6 rounded-2xl glass-panel border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Extracted Project Deadlines & Milestones</span>
            </h3>

            <div className="relative border-l-2 border-indigo-500/30 ml-4 space-y-6">
              {analysis.action_items.filter(a => a.deadline).length > 0 ? (
                analysis.action_items.filter(a => a.deadline).map((item, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    </div>
                    <div className="text-xs font-mono font-bold text-cyan-400">{item.deadline}</div>
                    <div className="text-sm font-bold text-white mt-0.5">{item.title}</div>
                    <div className="text-xs text-slate-400 mt-1">{item.description}</div>
                  </div>
                ))
              ) : (
                <div className="pl-6 text-xs text-slate-400">
                  No explicit calendar deadlines flagged in this document version.
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. RISKS TAB */}
        {activeTab === 'risks' && (
          <div className="space-y-3">
            {analysis.risks.map((risk) => (
              <div key={risk.id} className="p-5 rounded-xl glass-card border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                    risk.severity === 'high' ? 'text-rose-400' : 'text-amber-400'
                  }`} />
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        risk.severity === 'high'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {risk.severity} severity
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{risk.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => onProveIt('Risk Factor', 'Risk', risk.source_reference)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center space-x-1.5 shrink-0 self-end sm:self-center"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono">PROVE IT</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 5. QUESTIONS TAB */}
        {activeTab === 'questions' && (
          <div className="space-y-3">
            {analysis.questions.map((q) => (
              <div key={q.id} className="p-5 rounded-xl glass-card border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{q.question}</h4>
                    <p className="text-xs text-slate-400">Flagged as an ambiguous or missing specification needing confirmation.</p>
                  </div>
                </div>

                <button
                  onClick={() => onProveIt(q.question, 'Question', q.source_reference)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center space-x-1.5 shrink-0 self-end sm:self-center"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono">PROVE IT</span>
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
