/* Layout: AnalysisView component - Wraps full document analysis workspace matching skills.md */
import React from 'react';
import { AnalysisDashboard } from '../AnalysisDashboard';
import { DocumentItem, Analysis, SourceReference } from '../../types';

interface AnalysisViewProps {
  document: DocumentItem | null;
  analysis: Analysis | null;
  onToggleAction: (actionId: string, completed: boolean) => void;
  onProveIt: (title: string, type: 'Requirement' | 'Action Item' | 'Risk' | 'Question', ref?: SourceReference) => void;
  onViewDocumentFile: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  document,
  analysis,
  onToggleAction,
  onProveIt,
  onViewDocumentFile
}) => {
  if (!document || !analysis) {
    return (
      <div className="text-center py-16 p-8 glass-card border border-slate-200">
        <h3 className="text-sm font-bold text-slate-800">No Document Selected for Analysis</h3>
        <p className="text-xs text-slate-500 mt-1">Please select or upload a document to view its complete analysis workspace.</p>
      </div>
    );
  }

  return (
    <AnalysisDashboard
      document={document}
      analysis={analysis}
      onToggleAction={onToggleAction}
      onProveIt={onProveIt}
      onViewDocumentFile={onViewDocumentFile}
    />
  );
};
