// Premium: whileInView stagger, spring checkboxes, hover lift+glow, timeline pop-in,
//          animated tab indicator, celebration particles, gradient progress bar
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  ExternalLink,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { DocumentItem, Analysis, SourceReference } from '../types';
import { prefersReducedMotion } from '../lib/utils';

interface AnalysisDashboardProps {
  document: DocumentItem;
  analysis: Analysis;
  onToggleAction: (actionId: string, completed: boolean) => void;
  onProveIt: (title: string, type: 'Requirement' | 'Action Item' | 'Risk' | 'Question', ref?: SourceReference) => void;
  onViewDocumentFile: () => void;
}

const shouldAnimate = !prefersReducedMotion();
const viewport = { once: true, margin: '-80px' as const };
const spring = { type: 'spring' as const, stiffness: 300, damping: 30 };

const TABS = [
  { id: 'actions', label: 'Action Items', icon: ListChecks, countKey: 'action_items' as const },
  { id: 'requirements', label: 'Requirements', icon: FileText, countKey: 'requirements' as const },
  { id: 'timeline', label: 'Timeline', icon: Calendar, countKey: null },
  { id: 'risks', label: 'Risks', icon: AlertTriangle, countKey: 'risks' as const },
  { id: 'questions', label: 'Questions', icon: HelpCircle, countKey: 'questions' as const },
] as const;

type TabId = typeof TABS[number]['id'];

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  document,
  analysis,
  onToggleAction,
  onProveIt,
  onViewDocumentFile
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('actions');
  const [burstId, setBurstId] = useState<string | null>(null);

  const completedActionsCount = analysis.action_items.filter(a => a.completed).length;
  const totalActionsCount = analysis.action_items.length;
  const progressPercent = totalActionsCount > 0 ? Math.round((completedActionsCount / totalActionsCount) * 100) : 0;

  const priorityBadge = (priority: string) => {
    if (priority === 'high') return 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]';
    if (priority === 'medium') return 'bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]';
    return 'bg-[#F1F5F9] text-slate-500 border border-[#E2E8F0]';
  };

  const handleToggle = (id: string, completed: boolean) => {
    if (completed) {
      setBurstId(id);
      setTimeout(() => setBurstId(null), 600);
    }
    onToggleAction(id, completed);
  };

  const proveItBtn = (
    title: string,
    type: 'Requirement' | 'Action Item' | 'Risk' | 'Question',
    ref?: SourceReference
  ) => (
    <motion.button
      onClick={() => onProveIt(title, type, ref)}
      aria-label={`Prove source evidence for: ${title}`}
      whileHover={shouldAnimate ? { scale: 1.04, y: -1 } : {}}
      whileTap={shouldAnimate ? { scale: 0.96 } : {}}
      transition={spring}
      className="group px-3.5 py-2 rounded-xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] hover:from-[#DBEAFE] hover:to-[#BFDBFE] border border-[#BFDBFE]/80 text-[#3B82F6] text-xs font-bold flex items-center space-x-1.5 transition-colors shrink-0 self-end sm:self-center"
      style={{ boxShadow: '0 1px 3px rgba(59,130,246,0.12)' }}
    >
      <ShieldCheck className="w-3.5 h-3.5 text-[#10B981] group-hover:scale-110 transition-transform" aria-hidden="true" />
      <span className="font-mono tracking-wide">PROVE IT</span>
    </motion.button>
  );

  const tabCount = (tab: typeof TABS[number]) => {
    if (!tab.countKey) return null;
    const arr = analysis[tab.countKey];
    return Array.isArray(arr) ? arr.length : null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Executive Summary Card */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: 24 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white/85 backdrop-blur-xl rounded-3xl border border-[#E2E8F0]/50 overflow-hidden"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 16px 48px rgba(59,130,246,0.08)' }}
      >
        {/* Blue accent top bar */}
        <div className="h-1 bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#DBEAFE]" />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#E2E8F0]/50">
            <div>
              <div className="flex items-center space-x-2 text-xs text-[#3B82F6] font-mono font-medium mb-1.5">
                <Zap className="w-3 h-3" aria-hidden="true" />
                <span>DOCUMENT WORKSPACE</span>
                <span className="text-[#CBD5E1]">•</span>
                <span className="text-slate-400 truncate max-w-[200px]">{document.filename}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Executive AI Analysis
              </h2>
            </div>

            <motion.button
              onClick={onViewDocumentFile}
              whileHover={shouldAnimate ? { scale: 1.02, y: -1 } : {}}
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
              className="btn-ghost px-4 py-2 text-xs font-semibold flex items-center space-x-2 shrink-0"
              id="view-source-doc-btn"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#3B82F6]" aria-hidden="true" />
              <span>View Source Document</span>
            </motion.button>
          </div>

          <div className="pt-5">
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              {
                icon: CheckSquare,
                label: 'Action Items',
                value: `${completedActionsCount} / ${totalActionsCount}`,
                iconBg: 'bg-[#DBEAFE]',
                iconColor: 'text-[#3B82F6]',
              },
              {
                icon: FileText,
                label: 'Requirements',
                value: String(analysis.requirements.length),
                iconBg: 'bg-[#DBEAFE]',
                iconColor: 'text-[#3B82F6]',
              },
              {
                icon: AlertTriangle,
                label: 'Risks Flagged',
                value: String(analysis.risks.length),
                iconBg: 'bg-[#FEF2F2]',
                iconColor: 'text-[#EF4444]',
              },
              {
                icon: HelpCircle,
                label: 'Open Questions',
                value: String(analysis.questions.length),
                iconBg: 'bg-[#FFFBEB]',
                iconColor: 'text-[#F59E0B]',
              },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={shouldAnimate ? { opacity: 0, y: 14 } : false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewport}
                  transition={{ delay: i * 0.07, ...spring }}
                  whileHover={shouldAnimate ? { y: -3 } : {}}
                  className="p-4 rounded-2xl bg-[#F8FAFC]/80 border border-[#E2E8F0]/50 flex items-center space-x-3 cursor-default"
                >
                  <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4.5 h-4.5 ${stat.iconColor}`} style={{ width: 18, height: 18 }} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400 font-medium">{stat.label}</div>
                    <div className="text-lg font-extrabold text-slate-900 leading-tight">{stat.value}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl border border-[#E2E8F0]/50 overflow-x-auto scrollbar-none" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const count = tabCount(tab);
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={shouldAnimate && !isActive ? { backgroundColor: 'rgba(241,245,249,0.8)' } : {}}
              whileTap={shouldAnimate ? { scale: 0.97 } : {}}
              className={`relative flex items-center space-x-2 px-4 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-[#3B82F6] shadow-sm'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              style={isActive ? {
                boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(59,130,246,0.08)',
              } : {}}
              aria-selected={isActive}
              role="tab"
              id={`tab-${tab.id}`}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {tab.label}
                {count !== null && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-[#DBEAFE] text-[#3B82F6]' : 'bg-[#F1F5F9] text-slate-400'
                  }`}>
                    {count}
                  </span>
                )}
              </span>
              {/* Active tab animated underline */}
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#3B82F6] rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* ACTIONS */}
        {activeTab === 'actions' && (
          <motion.div
            key="actions"
            initial={shouldAnimate ? { opacity: 0, y: 14 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
            role="tabpanel"
            aria-labelledby="tab-actions"
          >
            {/* Progress bar */}
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-white/85 border border-[#E2E8F0]/50"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(59,130,246,0.06)' }}
            >
              <div className="flex items-center space-x-3 flex-1">
                <TrendingUp className="w-4 h-4 text-[#3B82F6] shrink-0" aria-hidden="true" />
                <div className="text-xs font-bold text-slate-700">Completion Progress</div>
                <div className="flex-1 h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden max-w-[180px]">
                  <motion.div
                    className="h-full progress-bar"
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ type: 'spring', stiffness: 90, damping: 22 }}
                    aria-valuenow={progressPercent}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <span className="text-xs font-extrabold text-[#3B82F6] tabular-nums">{progressPercent}%</span>
              </div>
              <span className="text-xs text-slate-400 font-mono shrink-0">
                {completedActionsCount} of {totalActionsCount} completed
              </span>
            </motion.div>

            <div className="space-y-3">
              {analysis.action_items.map((act, i) => (
                <motion.div
                  key={act.id}
                  initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewport}
                  transition={{ delay: i * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={shouldAnimate ? { y: -4 } : {}}
                  className={`relative p-4 sm:p-5 rounded-2xl bg-white/85 backdrop-blur-sm border border-[#E2E8F0]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-shadow duration-200 ${
                    act.completed ? 'opacity-70' : ''
                  }`}
                  style={{
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={(e) => {
                    if (shouldAnimate) (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(59,130,246,0.12), 0 2px 8px rgba(0,0,0,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                  }}
                >
                  {/* Celebration particles */}
                  <AnimatePresence>
                    {burstId === act.id && (
                      <>
                        {[...Array(8)].map((_, pi) => {
                          const angle = (pi / 8) * Math.PI * 2;
                          const dist = 28 + pi * 3;
                          return (
                            <motion.span
                              key={pi}
                              className="absolute w-2 h-2 rounded-full pointer-events-none"
                              style={{
                                left: 30,
                                top: 24,
                                backgroundColor: ['#10B981', '#3B82F6', '#60A5FA', '#34D399'][pi % 4],
                              }}
                              initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                              animate={{
                                opacity: 0,
                                x: Math.cos(angle) * dist,
                                y: Math.sin(angle) * dist,
                                scale: 0,
                              }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.5, ease: 'easeOut' }}
                              aria-hidden="true"
                            />
                          );
                        })}
                      </>
                    )}
                  </AnimatePresence>

                  <div className="flex items-start space-x-3 flex-1">
                    <motion.button
                      onClick={() => handleToggle(act.id, !act.completed)}
                      aria-label={act.completed ? `Mark "${act.title}" incomplete` : `Mark "${act.title}" complete`}
                      whileTap={shouldAnimate ? { scale: 0.8 } : {}}
                      transition={spring}
                      className="mt-0.5 shrink-0 check-animate"
                    >
                      <AnimatePresence mode="wait">
                        {act.completed ? (
                          <motion.div
                            key="checked"
                            initial={shouldAnimate ? { scale: 0, rotate: -20 } : false}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                          >
                            <CheckCircle2 className="w-5 h-5 text-[#10B981]" aria-hidden="true" />
                          </motion.div>
                        ) : (
                          <motion.div key="unchecked" initial={false} animate={{ scale: 1 }}>
                            <Circle className="w-5 h-5 text-slate-300 hover:text-[#3B82F6] transition-colors" aria-hidden="true" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    <div className="min-w-0">
                      <h4 className={`text-sm font-semibold ${act.completed ? 'text-slate-400 line-through' : 'text-slate-900'} transition-colors duration-200`}>
                        {act.title}
                      </h4>
                      {act.description && (
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{act.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${priorityBadge(act.priority)}`}>
                          {act.priority} priority
                        </span>
                        {act.deadline && (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-[#F8FAFC] text-slate-500 border border-[#E2E8F0]/60 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#3B82F6]" aria-hidden="true" />
                            {act.deadline}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end sm:shrink-0">
                    {proveItBtn(act.title, 'Action Item', act.source_reference)}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* REQUIREMENTS */}
        {activeTab === 'requirements' && (
          <motion.div
            key="requirements"
            initial={shouldAnimate ? { opacity: 0, y: 14 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
            role="tabpanel"
            aria-labelledby="tab-requirements"
          >
            {analysis.requirements.map((req, i) => (
              <motion.div
                key={req.id}
                initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                whileHover={shouldAnimate ? { y: -4 } : {}}
                className="group p-5 rounded-2xl bg-white/85 border border-[#E2E8F0]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-shadow duration-200"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                onMouseEnter={(e) => {
                  if (shouldAnimate) (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(59,130,246,0.12)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                }}
              >
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-[#DBEAFE] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-[#3B82F6]">{i + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-[#2563EB] transition-colors duration-200">{req.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{req.description}</p>
                  </div>
                </div>
                {proveItBtn(req.title, 'Requirement', req.source_reference)}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* TIMELINE */}
        {activeTab === 'timeline' && (
          <motion.div
            key="timeline"
            initial={shouldAnimate ? { opacity: 0, y: 14 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8 rounded-3xl bg-white/85 border border-[#E2E8F0]/50"
            style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 16px 48px rgba(59,130,246,0.06)' }}
            role="tabpanel"
            aria-labelledby="tab-timeline"
          >
            <h3 className="text-sm font-bold text-slate-900 mb-8 flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#DBEAFE] flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5 text-[#3B82F6]" aria-hidden="true" />
              </div>
              <span>Extracted Project Deadlines &amp; Milestones</span>
            </h3>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#3B82F6] via-[#DBEAFE] to-transparent" aria-hidden="true" />

              <div className="space-y-8">
                {analysis.action_items.filter(a => a.deadline).length > 0 ? (
                  analysis.action_items.filter(a => a.deadline).map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={shouldAnimate ? { opacity: 0, x: -16 } : false}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={viewport}
                      transition={{ delay: idx * 0.1, ...spring }}
                      className="relative pl-10"
                    >
                      {/* Timeline dot */}
                      <motion.div
                        initial={shouldAnimate ? { scale: 0 } : false}
                        whileInView={{ scale: 1 }}
                        viewport={viewport}
                        transition={{ delay: idx * 0.1 + 0.12, type: 'spring', stiffness: 400, damping: 15 }}
                        className="absolute left-0 top-0.5 w-[38px] h-[38px] -ml-[9px] rounded-full bg-white border-2 border-[#3B82F6] flex items-center justify-center shadow-sm"
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                      </motion.div>

                      <div className="text-[11px] font-mono font-bold text-[#3B82F6] uppercase tracking-wider mb-0.5">{item.deadline}</div>
                      <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="pl-10 text-xs text-slate-400 py-4">
                    No explicit calendar deadlines flagged in this document version.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* RISKS */}
        {activeTab === 'risks' && (
          <motion.div
            key="risks"
            initial={shouldAnimate ? { opacity: 0, y: 14 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
            role="tabpanel"
            aria-labelledby="tab-risks"
          >
            {analysis.risks.map((risk, i) => (
              <motion.div
                key={risk.id}
                initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ delay: i * 0.07 }}
                whileHover={shouldAnimate ? { y: -4 } : {}}
                className={`p-5 rounded-2xl bg-white/85 border border-[#E2E8F0]/50 border-l-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-shadow duration-200 ${
                  risk.severity === 'high'
                    ? 'border-l-[#EF4444]'
                    : 'border-l-[#F59E0B]'
                }`}
                style={{
                  boxShadow: risk.severity === 'high'
                    ? '0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(239,68,68,0.07)'
                    : '0 1px 3px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={(e) => {
                  if (shouldAnimate) {
                    (e.currentTarget as HTMLElement).style.boxShadow = risk.severity === 'high'
                      ? '0 8px 30px rgba(239,68,68,0.12)'
                      : '0 8px 30px rgba(245,158,11,0.10)';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = risk.severity === 'high'
                    ? '0 1px 3px rgba(0,0,0,0.04), 0 4px 20px rgba(239,68,68,0.07)'
                    : '0 1px 3px rgba(0,0,0,0.04)';
                }}
              >
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    risk.severity === 'high' ? 'bg-[#FEF2F2]' : 'bg-[#FFFBEB]'
                  }`}>
                    <AlertTriangle className={`w-4 h-4 ${
                      risk.severity === 'high' ? 'text-[#EF4444]' : 'text-[#F59E0B]'
                    }`} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1.5">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${priorityBadge(risk.severity)}`}>
                        {risk.severity} severity
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{risk.description}</p>
                  </div>
                </div>
                {proveItBtn('Risk Factor', 'Risk', risk.source_reference)}
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* QUESTIONS */}
        {activeTab === 'questions' && (
          <motion.div
            key="questions"
            initial={shouldAnimate ? { opacity: 0, y: 14 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
            role="tabpanel"
            aria-labelledby="tab-questions"
          >
            {analysis.questions.map((q, i) => (
              <motion.div
                key={q.id}
                initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewport}
                transition={{ delay: i * 0.07 }}
                whileHover={shouldAnimate ? { y: -4 } : {}}
                className="p-5 rounded-2xl bg-white/85 border border-[#E2E8F0]/50 border-l-4 border-l-[#F59E0B] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-shadow duration-200"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                onMouseEnter={(e) => {
                  if (shouldAnimate) (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(245,158,11,0.10)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
                }}
              >
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-[#FFFBEB] flex items-center justify-center shrink-0 mt-0.5">
                    <HelpCircle className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-1">{q.question}</h4>
                    <p className="text-xs text-slate-500">Flagged as an ambiguous or missing specification needing confirmation.</p>
                  </div>
                </div>
                {proveItBtn(q.question, 'Question', q.source_reference)}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
