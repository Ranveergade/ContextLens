/* Layout: SettingsView component - Application configuration placeholder matching skills.md */
import React from 'react';
import { Settings, Server, Cpu, Database, Shield } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-600 uppercase">
            <Settings className="w-4 h-4" />
            <span>System Settings</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            ContextLens Configuration & API Status
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="p-6 rounded-xl glass-card border border-slate-200 bg-white space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Backend REST API</h3>
              <p className="text-xs text-slate-500 font-mono">http://localhost:8000/api</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            FastAPI server with CORS enabled. Active endpoints: `/documents`, `/analyze`, `/actions`, `/text`.
          </p>
        </div>

        <div className="p-6 rounded-xl glass-card border border-slate-200 bg-white space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Gemma 4 AI Engine</h3>
              <p className="text-xs text-slate-500 font-mono">llama-3.1-8b-instant / gemini-2.5-flash</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            JSON Schema constrained outputs with fallback rule-based citation engine.
          </p>
        </div>

        <div className="p-6 rounded-xl glass-card border border-slate-200 bg-white space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Database Engine</h3>
              <p className="text-xs text-slate-500 font-mono">sqlite:///./contextlens.db</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            SQLAlchemy 2.0 ORM with persistent action item completion status across reloads.
          </p>
        </div>

        <div className="p-6 rounded-xl glass-card border border-slate-200 bg-white space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Traceability & Security</h3>
              <p className="text-xs text-slate-500 font-mono">PROVE IT Evidence Citation v1.0</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            100% verifiable source quotes mapped to document page numbers.
          </p>
        </div>

      </div>
    </div>
  );
};
