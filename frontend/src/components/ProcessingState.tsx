// Premium: animated progress ring, NumberFlow %, pulsing active step dot,
//          scan beam with glow, floating particles, step connector line fill
import React from 'react';
import { motion } from 'motion/react';
import NumberFlow from '@number-flow/react';
import { Cpu, FileText, CheckCircle2, Loader2, Sparkles, Database } from 'lucide-react';
import { prefersReducedMotion } from '../lib/utils';

interface ProcessingStateProps {
  filename: string;
  step: 'uploading' | 'parsing' | 'analyzing' | 'building';
}

const shouldAnimate = !prefersReducedMotion();

const STEPS = [
  { id: 'uploading', label: '1. File Upload & Storage', icon: FileText, color: '#3B82F6' },
  { id: 'parsing', label: '2. Text & Page Structure Extraction', icon: FileText, color: '#3B82F6' },
  { id: 'analyzing', label: '3. Gemma 4 AI Analysis & Extraction', icon: Sparkles, color: '#8B5CF6' },
  { id: 'building', label: '4. Mapping "PROVE IT" Source References', icon: Database, color: '#10B981' },
];

const ORDER = ['uploading', 'parsing', 'analyzing', 'building'];

export const ProcessingState: React.FC<ProcessingStateProps> = ({ filename, step }) => {
  const getStepStatus = (stepId: string) => {
    const currentIndex = ORDER.indexOf(step);
    const targetIndex = ORDER.indexOf(stepId);
    if (targetIndex < currentIndex) return 'completed';
    if (targetIndex === currentIndex) return 'active';
    return 'pending';
  };

  const progressPercent = Math.round(((ORDER.indexOf(step) + 1) / ORDER.length) * 100);
  const circumference = 2 * Math.PI * 38;
  const strokeOffset = circumference - (progressPercent / 100) * circumference;

  // Particle positions
  const particles = [
    { left: '12%', size: 6, delay: 0, dur: 2.2 },
    { left: '25%', size: 4, delay: 0.4, dur: 2.8 },
    { left: '40%', size: 5, delay: 0.8, dur: 2.4 },
    { left: '55%', size: 4, delay: 0.2, dur: 3.0 },
    { left: '70%', size: 6, delay: 0.6, dur: 2.6 },
    { left: '84%', size: 4, delay: 1.0, dur: 2.2 },
  ];

  return (
    <div className="max-w-xl mx-auto my-16 px-4">
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: 24, scale: 0.97 } : false}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel p-8 rounded-3xl text-center relative overflow-hidden"
        style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 20px 60px rgba(59,130,246,0.10)' }}
      >
        {/* Floating particles — drift upward */}
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#3B82F6]/35 pointer-events-none"
            style={{ left: p.left, bottom: 20, width: p.size, height: p.size }}
            animate={shouldAnimate ? {
              y: [0, -(90 + i * 12)],
              opacity: [0, 0.75, 0.4, 0],
              x: [0, (i % 2 === 0 ? 8 : -8), 0],
            } : {}}
            transition={{
              duration: p.dur,
              repeat: Infinity,
              delay: p.delay,
              ease: 'easeOut',
            }}
            aria-hidden="true"
          />
        ))}

        {/* Subtle background radial */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 30%, rgba(59,130,246,0.06), transparent 65%)',
          }}
          aria-hidden="true"
        />

        {/* Document scanner mockup */}
        <div className="relative w-full max-w-xs mx-auto mb-7 h-32 rounded-2xl bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] border border-[#E2E8F0]/70 overflow-hidden shadow-sm">
          <div className="scanner-beam" />
          {/* Document content skeleton */}
          <div className="absolute inset-0 flex flex-col justify-center px-7 gap-2.5 opacity-35">
            <div className="h-2 bg-[#CBD5E1] rounded-full w-3/4" />
            <div className="h-2 bg-[#CBD5E1] rounded-full w-full" />
            <div className="h-2 bg-[#CBD5E1] rounded-full w-5/6" />
            <div className="h-2 bg-[#CBD5E1] rounded-full w-2/3" />
            <div className="h-2 bg-[#CBD5E1] rounded-full w-4/5" />
          </div>
          {/* GEMMA 4 label */}
          <div className="absolute top-2 right-3 text-[9px] font-bold text-[#3B82F6]/50 uppercase tracking-widest font-mono">
            GEMMA 4
          </div>
        </div>

        {/* Circular progress ring + Cpu icon */}
        <div className="relative w-28 h-28 mx-auto mb-5 flex items-center justify-center">
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 84 84"
            aria-hidden="true"
          >
            {/* Track */}
            <circle cx="42" cy="42" r="38" fill="none" stroke="#E2E8F0" strokeWidth="4.5" />
            {/* Progress */}
            <motion.circle
              cx="42"
              cy="42"
              r="38"
              fill="none"
              stroke="url(#progressGrad)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: strokeOffset }}
              transition={{ type: 'spring', stiffness: 90, damping: 22 }}
            />
            <defs>
              <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#60A5FA" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center icon */}
          <motion.div
            className="w-16 h-16 rounded-2xl bg-white border border-[#E2E8F0]/70 flex items-center justify-center shadow-sm z-10"
            animate={shouldAnimate ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Cpu className="w-7 h-7 text-[#3B82F6]" aria-hidden="true" />
          </motion.div>
        </div>

        {/* Title + filename */}
        <h3 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">
          Gemma 4 Processing Document
        </h3>
        <p className="text-xs text-[#3B82F6] font-mono mb-3 truncate max-w-sm mx-auto px-4 bg-[#EFF6FF] rounded-lg py-1 mx-auto inline-block">
          {filename}
        </p>

        {/* Animated percentage */}
        <div className="text-3xl font-extrabold text-slate-900 mb-6 flex items-center justify-center gap-0.5 tabular-nums" aria-live="polite" aria-label={`${progressPercent}% complete`}>
          <NumberFlow value={progressPercent} />
          <span className="text-[#3B82F6]">%</span>
        </div>

        {/* Step checklist with connector lines */}
        <div className="space-y-0 text-left max-w-md mx-auto relative">
          {STEPS.map((s, idx) => {
            const status = getStepStatus(s.id);
            const Icon = s.icon;
            const isLast = idx === STEPS.length - 1;
            return (
              <motion.div
                key={s.id}
                initial={shouldAnimate ? { opacity: 0, x: -16 } : false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Connector line */}
                {!isLast && (
                  <div className="absolute left-[13px] top-[28px] bottom-0 w-0.5 bg-[#E2E8F0]" aria-hidden="true">
                    <motion.div
                      className="w-full bg-[#3B82F6] origin-top"
                      animate={{
                        height: status === 'completed' ? '100%' : '0%',
                      }}
                      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between text-xs py-3 px-3 rounded-xl relative">
                  <div className="flex items-center space-x-3">
                    {/* Step dot/icon */}
                    <div className="relative shrink-0 z-10">
                      {status === 'active' && shouldAnimate && (
                        <motion.span
                          className="absolute inset-0 rounded-full"
                          style={{ backgroundColor: `${s.color}30` }}
                          animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          aria-hidden="true"
                        />
                      )}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center relative transition-colors duration-300 ${
                          status === 'active'
                            ? 'bg-[#EFF6FF] border-2 border-[#3B82F6]'
                            : status === 'completed'
                              ? 'bg-[#ECFDF5] border-2 border-[#10B981]'
                              : 'bg-[#F1F5F9] border-2 border-[#E2E8F0]'
                        }`}
                      >
                        {status === 'completed' ? (
                          <motion.div
                            initial={shouldAnimate ? { scale: 0, rotate: -20 } : false}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                          >
                            <CheckCircle2 className="w-3 h-3 text-[#10B981]" aria-hidden="true" />
                          </motion.div>
                        ) : status === 'active' ? (
                          <Icon className="w-3 h-3 text-[#3B82F6]" aria-hidden="true" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#CBD5E1]" aria-hidden="true" />
                        )}
                      </div>
                    </div>

                    <span className={`font-medium transition-colors duration-200 ${
                      status === 'active' ? 'text-[#3B82F6] font-semibold' :
                      status === 'completed' ? 'text-slate-700' :
                      'text-slate-300'
                    }`}>
                      {s.label}
                    </span>
                  </div>

                  {/* Status indicator */}
                  {status === 'completed' ? (
                    <span className="text-[#10B981] text-[10px] font-bold uppercase tracking-wider shrink-0">Done</span>
                  ) : status === 'active' ? (
                    <Loader2 className="w-3.5 h-3.5 text-[#3B82F6] animate-spin shrink-0" aria-label="In progress" />
                  ) : (
                    <span className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
