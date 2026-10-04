/* Layout: EvidenceView component - Searchable evidence explorer matching skills.md */
import React, { useState } from 'react';
import { DocumentItem, Analysis } from '../../types';
import { Search, ShieldCheck, FileText, ExternalLink } from 'lucide-react';

interface EvidenceViewProps {
  document: DocumentItem | null;
  analysis: Analysis | null;
  onHighlightInFile: (text: string, page?: number) => void;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({
  document,
  analysis,
  onHighlightInFile
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!analysis || !document) {
    return (
      <div className="text-center py-16 p-8 glass-card border border-slate-200">
        <p className="text-xs text-slate-500">No document evidence citations loaded. Please select a document.</p>
      </div>
    );
  }

  // Gather all evidence items across requirements, actions, risks, questions
  const allEvidenceItems: Array<{
    id: string;
    title: string;
    type: string;
    page: number;
    text: string;
  }> = [];

  analysis.requirements.forEach(r => {
    if (r.source_reference?.text) {
      allEvidenceItems.push({
        id: r.id,
        title: r.title,
        type: 'Requirement',
        page: r.source_reference.page || 1,
        text: r.source_reference.text
      });
    }
  });

  analysis.action_items.forEach(a => {
    if (a.source_reference?.text) {
      allEvidenceItems.push({
        id: a.id,
        title: a.title,
        type: 'Action Item',
        page: a.source_reference.page || 1,
        text: a.source_reference.text
      });
    }
  });

  analysis.risks.forEach(rk => {
    if (rk.source_reference?.text) {
      allEvidenceItems.push({
        id: rk.id,
        title: rk.description.slice(0, 50) + '...',
        type: 'Risk',
        page: rk.source_reference.page || 1,
        text: rk.source_reference.text
      });
    }
  });

  const filteredItems = allEvidenceItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 uppercase">
            <Search className="w-4 h-4" />
            <span>Evidence Explorer</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">
            Searchable PROVE IT Citation Records ({filteredItems.length})
          </h1>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search evidence text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500 shadow-xs"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredItems.map((item, idx) => (
          <div key={idx} className="p-5 rounded-xl glass-card border border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {item.type}
                </span>
                <span className="text-xs font-bold text-slate-900 truncate max-w-xs">{item.title}</span>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 border border-slate-200">
                Page {item.page}
              </span>
            </div>

            <p className="text-xs font-serif text-slate-700 leading-relaxed italic bg-slate-50 p-3 rounded-lg border-l-3 border-l-blue-500">
              "{item.text}"
            </p>

            <div className="flex justify-end">
              <button
                onClick={() => onHighlightInFile(item.text, item.page)}
                className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer border border-blue-200"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Highlight In Document</span>
                <ExternalLink className="w-3 h-3 text-blue-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
