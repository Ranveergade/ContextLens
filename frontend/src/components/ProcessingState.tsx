import React from 'react';
import { Cpu, FileText, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface ProcessingStateProps {
  filename: string;
  step: 'uploading' | 'parsing' | 'analyzing' | 'building';
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({ filename, step }) => {
  const getStepStatus = (currentStepName: string) => {
    const order = ['uploading', 'parsing', 'analyzing', 'building'];
    const currentIndex = order.indexOf(step);
    const targetIndex = order.indexOf(currentStepName);

    if (targetIndex < currentIndex) return 'completed';
    if (targetIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="max-w-xl mx-auto my-12 px-4">
      <div className="glass-panel p-8 rounded-2xl border border-slate-800 text-center relative overflow-hidden shadow-2xl">
        
        {/* Animated Scanner Laser Beam */}
        <div className="animate-scan-beam" />

        {/* Center Scanner Graphic */}
        <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 opacity-20 blur-xl animate-pulse" />
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-indigo-400 shadow-xl relative z-10">
            <Cpu className="w-8 h-8 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        <h3 className="text-lg font-bold text-white mb-1">
          Gemma 4 Processing Document
        </h3>
        <p className="text-xs text-indigo-300 font-mono mb-6 truncate max-w-sm mx-auto">
          {filename}
        </p>

        {/* Multi-Step Checklist */}
        <div className="space-y-3 text-left max-w-md mx-auto bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          
          {/* Step 1 */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300 font-medium">1. File Upload & Storage</span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>

          {/* Step 2 */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-slate-400" />
              <span className="text-slate-300 font-medium">2. Text & Page Structure Extraction</span>
            </div>
            {getStepStatus('parsing') === 'completed' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : getStepStatus('parsing') === 'active' ? (
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-slate-700" />
            )}
          </div>

          {/* Step 3 */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-slate-300 font-medium">3. Gemma 4 AI Analysis & Extraction</span>
            </div>
            {getStepStatus('analyzing') === 'completed' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : getStepStatus('analyzing') === 'active' ? (
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-slate-700" />
            )}
          </div>

          {/* Step 4 */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span className="text-slate-300 font-medium">4. Mapping "PROVE IT" Source References</span>
            </div>
            {getStepStatus('building') === 'completed' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : getStepStatus('building') === 'active' ? (
              <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-slate-700" />
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
