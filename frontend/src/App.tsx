/* Layout: Main App component - 3-zone layout (Navbar, Sidebar 20%, ContentArea 80%) with Lenis smooth scroll matching skills.md */
import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { Navbar } from './components/Navbar';
import { Sidebar, MenuId } from './components/Sidebar';
import { ContentArea } from './components/ContentArea';
import { EvidenceModal } from './components/EvidenceModal';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { api } from './services/api';
import { DocumentItem, Analysis, SourceReference } from './types';
import { AlertCircle } from 'lucide-react';

export function App() {
  const [activeMenu, setActiveMenu] = useState<MenuId>('overview');
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | undefined>();
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);

  // Loading & Processing state
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal States
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceType, setEvidenceType] = useState<'Requirement' | 'Action Item' | 'Risk' | 'Question'>('Action Item');
  const [currentEvidence, setCurrentEvidence] = useState<SourceReference | null>(null);

  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [highlightText, setHighlightText] = useState<string | undefined>(undefined);
  const [highlightPage, setHighlightPage] = useState<number | undefined>(undefined);

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  // Load document list on initial mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const docs = await api.getDocuments();
      setDocuments(docs);
      if (docs.length > 0 && !selectedDocId) {
        loadDocumentAnalysis(docs[0].id);
      }
    } catch (err: any) {
      console.error('Failed to load documents:', err);
    }
  };

  const loadDocumentAnalysis = async (docId: string) => {
    setSelectedDocId(docId);
    setErrorMsg(null);
    try {
      const analysis = await api.getAnalysis(docId);
      setCurrentAnalysis(analysis);
    } catch (err: any) {
      try {
        const newAnalysis = await api.analyzeDocument(docId);
        setCurrentAnalysis(newAnalysis);
      } catch (analyzeErr: any) {
        setErrorMsg(`Failed to analyze document: ${analyzeErr.message}`);
      }
    }
  };

  const handleFileUpload = async (file: File) => {
    setErrorMsg(null);
    setIsUploading(true);

    try {
      const doc = await api.uploadDocument(file);
      setDocuments(prev => [doc, ...prev]);
      setSelectedDocId(doc.id);

      const analysis = await api.analyzeDocument(doc.id);
      setCurrentAnalysis(analysis);
      setIsUploading(false);
      setActiveMenu('analysis');
      fetchDocuments();
    } catch (err: any) {
      setIsUploading(false);
      setErrorMsg(`Document processing failed: ${err.message || 'Unknown error'}`);
    }
  };

  const handleTrySample = async () => {
    const sampleText = `CONTEXTLENS HACKATHON PROJECT SPECIFICATION
Version: 1.0.4
Target Release: Hackathon Final Submission

OVERVIEW
ContextLens is an AI-powered document intelligence workspace. The platform enables users to upload complex documents (PDFs, screenshots, text files), automatically extracts structured insights, and provides complete source evidence ("PROVE IT") for every AI claim.

SECTION 1: CORE REQUIREMENTS
1. The application must allow uploading PDF, PNG, JPG, and TXT files under 25MB.
2. The AI backend shall process documents using Gemma 4 model architecture with strict structured outputs.
3. Every extracted requirement, action item, risk, and question must maintain a traceable source reference citing page number and verbatim text snippet.
4. The system must persist analysis results in SQLite/PostgreSQL and preserve completion status upon page refresh.
5. Mobile responsive design is required across all primary dashboard views.

SECTION 2: ACTION ITEMS & DELIVERABLES
- Deliverable A: Public GitHub repository containing complete source code and documentation.
- Deliverable B: 90-second video demo showing PDF upload, AI analysis generation, and "PROVE IT" evidence interaction.
- Task 1: Complete FastAPI backend API endpoints for document management and action updates.
- Task 2: Build modern Vite + React frontend with dark-mode UI and interactive evidence modal.
- Task 3: Execute automated end-to-end integration test suite before final submission.

SECTION 3: DEADLINES
- Final Code Freeze: May 15, 2026 at 11:59 PM EST.
- Video Demo Upload: May 16, 2026 at 10:00 AM EST.
- Live Judging Presentation: May 17, 2026 at 2:00 PM EST.

SECTION 4: RISKS AND AMBIGUITIES
- Risk 1: Gemma API rate limiting during high concurrency judging window. Severity: High.
- Risk 2: Parsing multi-column scanned PDF documents might produce fragmented text lines. Severity: Medium.
- Question 1: Should we implement offline caching for processed documents?
- Question 2: What is the maximum number of simultaneous document uploads permitted per user session?`;

    const blob = new Blob([sampleText], { type: 'text/plain' });
    const sampleFile = new File([blob], 'sample_hackathon_spec.txt', { type: 'text/plain' });
    await handleFileUpload(sampleFile);
  };

  const handleToggleAction = async (actionId: string, completed: boolean) => {
    if (!currentAnalysis) return;

    setCurrentAnalysis(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        action_items: prev.action_items.map(act =>
          act.id === actionId ? { ...act, completed } : act
        )
      };
    });

    try {
      await api.updateActionStatus(actionId, completed);
    } catch (err: any) {
      console.error('Failed to update action:', err);
      loadDocumentAnalysis(selectedDocId!);
    }
  };

  const handleProveIt = async (title: string, type: 'Requirement' | 'Action Item' | 'Risk' | 'Question', ref?: SourceReference) => {
    setEvidenceTitle(title);
    setEvidenceType(type);
    setCurrentEvidence(ref || { page: 1, text: 'Source evidence passage is cited from uploaded document.' });
    setEvidenceModalOpen(true);
  };

  const handleHighlightInFile = (text: string, page?: number) => {
    setHighlightText(text);
    setHighlightPage(page);
    setViewerModalOpen(true);
  };

  const currentDocument = documents.find(d => d.id === selectedDocId) || null;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* 1. Navbar: Full width, 64px height, fixed */}
      <Navbar
        documents={documents}
        selectedDocId={selectedDocId}
        onSelectDoc={(id) => loadDocumentAnalysis(id)}
        onOpenSettings={() => setActiveMenu('settings')}
      />

      {/* Main Layout Container (starts below Navbar 64px) */}
      <div className="flex pt-16">
        {/* 2. Sidebar: Left 20% width (min 240px, max 320px) */}
        <Sidebar
          activeMenu={activeMenu}
          onSelectMenu={(menuId) => setActiveMenu(menuId)}
          documentCount={documents.length}
          actionCount={currentAnalysis?.action_items.length || 0}
          riskCount={currentAnalysis?.risks.length || 0}
        />

        {/* 3. ContentArea: Right 80% width */}
        <ContentArea
          activeMenu={activeMenu}
          documents={documents}
          currentDocument={currentDocument}
          analysis={currentAnalysis}
          isAnalyzing={isUploading}
          onFileUpload={handleFileUpload}
          onTrySample={handleTrySample}
          onSelectDocument={(id) => loadDocumentAnalysis(id)}
          onToggleAction={handleToggleAction}
          onProveIt={handleProveIt}
          onViewDocumentFile={() => {
            setHighlightText(undefined);
            setHighlightPage(undefined);
            setViewerModalOpen(true);
          }}
          onHighlightInFile={handleHighlightInFile}
        />
      </div>

      {/* Error notification banner */}
      {errorMsg && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs shadow-xl flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg(null)}
            className="ml-4 font-bold hover:text-red-900 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Modals */}
      <EvidenceModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        itemTitle={evidenceTitle}
        itemType={evidenceType}
        evidence={currentEvidence}
        documentFilename={currentDocument?.filename || 'Uploaded Document'}
        onHighlightInFile={handleHighlightInFile}
      />

      <DocumentViewerModal
        isOpen={viewerModalOpen}
        onClose={() => setViewerModalOpen(false)}
        document={currentDocument}
        highlightText={highlightText}
        pageNumber={highlightPage}
      />
    </div>
  );
}

export default App;
