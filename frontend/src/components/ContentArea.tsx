/* Layout: ContentArea component - Takes remaining 80% width, 32px padding, handles AnimatePresence view transitions matching skills.md */
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MenuId } from './Sidebar';
import { DocumentItem, Analysis, SourceReference } from '../types';

import { OverviewView } from './views/OverviewView';
import { DocumentsView } from './views/DocumentsView';
import { AnalysisView } from './views/AnalysisView';
import { RequirementsView } from './views/RequirementsView';
import { ActionItemsView } from './views/ActionItemsView';
import { TimelineView } from './views/TimelineView';
import { RisksView } from './views/RisksView';
import { QuestionsView } from './views/QuestionsView';
import { EvidenceView } from './views/EvidenceView';
import { SettingsView } from './views/SettingsView';

interface ContentAreaProps {
  activeMenu: MenuId;
  documents: DocumentItem[];
  currentDocument: DocumentItem | null;
  analysis: Analysis | null;
  isAnalyzing: boolean;
  onFileUpload: (file: File) => void;
  onTrySample: () => void;
  onSelectDocument: (docId: string) => void;
  onToggleAction: (actionId: string, completed: boolean) => void;
  onProveIt: (title: string, type: 'Requirement' | 'Action Item' | 'Risk' | 'Question', ref?: SourceReference) => void;
  onViewDocumentFile: () => void;
  onHighlightInFile: (text: string, page?: number) => void;
}

export const ContentArea: React.FC<ContentAreaProps> = ({
  activeMenu,
  documents,
  currentDocument,
  analysis,
  isAnalyzing,
  onFileUpload,
  onTrySample,
  onSelectDocument,
  onToggleAction,
  onProveIt,
  onViewDocumentFile,
  onHighlightInFile
}) => {
  const renderView = () => {
    switch (activeMenu) {
      case 'overview':
        return (
          <OverviewView
            document={currentDocument}
            analysis={analysis}
            onTrySample={onTrySample}
            onFileUpload={onFileUpload}
            onProveIt={onProveIt}
          />
        );
      case 'documents':
        return (
          <DocumentsView
            documents={documents}
            currentDocument={currentDocument}
            onFileUpload={onFileUpload}
            onTrySample={onTrySample}
            onSelectDocument={onSelectDocument}
            isAnalyzing={isAnalyzing}
          />
        );
      case 'analysis':
        return (
          <AnalysisView
            document={currentDocument}
            analysis={analysis}
            onToggleAction={onToggleAction}
            onProveIt={onProveIt}
            onViewDocumentFile={onViewDocumentFile}
          />
        );
      case 'requirements':
        return (
          <RequirementsView
            document={currentDocument}
            analysis={analysis}
            onProveIt={onProveIt}
          />
        );
      case 'actions':
        return (
          <ActionItemsView
            document={currentDocument}
            analysis={analysis}
            onToggleAction={onToggleAction}
            onProveIt={onProveIt}
          />
        );
      case 'timeline':
        return (
          <TimelineView
            document={currentDocument}
            analysis={analysis}
            onProveIt={onProveIt}
          />
        );
      case 'risks':
        return (
          <RisksView
            document={currentDocument}
            analysis={analysis}
            onProveIt={onProveIt}
          />
        );
      case 'questions':
        return (
          <QuestionsView
            document={currentDocument}
            analysis={analysis}
            onProveIt={onProveIt}
          />
        );
      case 'evidence':
        return (
          <EvidenceView
            document={currentDocument}
            analysis={analysis}
            onHighlightInFile={onHighlightInFile}
          />
        );
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <OverviewView
            document={currentDocument}
            analysis={analysis}
            onTrySample={onTrySample}
            onFileUpload={onFileUpload}
            onProveIt={onProveIt}
          />
        );
    }
  };

  return (
    <main className="ml-[20%] min-ml-[240px] max-ml-[320px] flex-1 p-8 min-h-[calc(100vh-64px)] bg-white bg-[radial-gradient(at_0%_0%,rgba(219,234,254,0.3)_0px,transparent_50%)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMenu}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-6xl mx-auto"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
    </main>
  );
};
