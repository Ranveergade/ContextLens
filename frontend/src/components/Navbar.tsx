/* Layout: Navbar component - Fixed top 64px height, full width, white background with backdrop blur matching skills.md */
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Layers, Sparkles, FileText, Settings, User } from 'lucide-react';
import { DocumentItem } from '../types';

interface NavbarProps {
  documents: DocumentItem[];
  selectedDocId?: string;
  onSelectDoc: (docId: string) => void;
  onOpenSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  documents,
  selectedDocId,
  onSelectDoc,
  onOpenSettings
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 h-16 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 flex items-center justify-between transition-shadow duration-200 ${
        scrolled ? 'shadow-sm' : ''
      }`}
    >
      {/* Left: Brand Logo & Tagline */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5 cursor-pointer hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                ContextLens
              </span>
              {/* Gemma 4 Badge */}
              <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-200 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500" /> Gemma 4
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Document Selector, Settings, User Avatar */}
      <div className="flex items-center space-x-3">
        {documents.length > 0 && (
          <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <FileText className="w-4 h-4 text-slate-400" />
            <select
              value={selectedDocId || ''}
              onChange={(e) => onSelectDoc(e.target.value)}
              className="bg-transparent text-xs text-slate-800 font-medium focus:outline-none cursor-pointer pr-4"
              aria-label="Select Document"
            >
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id} className="text-slate-900">
                  {doc.filename} ({doc.file_type})
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={onOpenSettings}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
          <User className="w-4 h-4" />
        </div>
      </div>
    </motion.header>
  );
};
