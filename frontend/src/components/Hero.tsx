import React from 'react';
import { ShieldCheck, Cpu, FileCheck, Target, ArrowRight } from 'lucide-react';

interface HeroProps {
  onStartUpload: () => void;
  onTrySample: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartUpload, onTrySample }) => {
  return (
    <div className="relative pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      
      {/* Top Tagline Badge */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-medium mb-6 shadow-xl backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span>AI Document Understanding & Actionable Workspace</span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
        Understand everything.<br />
        <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-200 bg-clip-text text-transparent">
          Act on what matters.
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
        Upload complex PDFs, specifications, or screenshots. Powered by <span className="text-slate-200 font-semibold">Gemma 4</span> to extract requirements, action items, risks, and verify every claim with <span className="text-cyan-400 font-semibold font-mono">"PROVE IT"</span> source evidence.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        <button
          onClick={onStartUpload}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2 transform hover:-translate-y-0.5"
        >
          <span>Analyze Your Document</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onTrySample}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl glass-card text-slate-300 hover:text-white font-medium text-sm transition-all flex items-center justify-center space-x-2"
        >
          <FileCheck className="w-4 h-4 text-cyan-400" />
          <span>Try Sample Hackathon Spec</span>
        </button>
      </div>

      {/* 4 Pillar Value Props */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
        
        <div className="p-4 rounded-xl glass-card border border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-3">
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">Gemma 4 AI</h3>
          <p className="text-xs text-slate-400">Structured document understanding without factual hallucination.</p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-3">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">"PROVE IT" Evidence</h3>
          <p className="text-xs text-slate-400">Every item is traceable directly to exact page verbatim snippets.</p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-3">
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">Action Items</h3>
          <p className="text-xs text-slate-400">Interactive workspace to check off tasks with state persistence.</p>
        </div>

        <div className="p-4 rounded-xl glass-card border border-slate-800/80">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
            <FileCheck className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">Multi-Format</h3>
          <p className="text-xs text-slate-400">Supports PDF documents, TXT specs, and image screenshots.</p>
        </div>

      </div>

    </div>
  );
};
