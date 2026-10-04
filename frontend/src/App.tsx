import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { UploadZone } from './components/UploadZone';
import { ProcessingState } from './components/ProcessingState';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { EvidenceModal } from './components/EvidenceModal';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { api } from './services/api';
import { DocumentItem, Analysis, SourceReference } from './types';
import { AlertCircle } from 'lucide-react';

export function App() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedDocId, setSelectedDocId] = useState<string | undefined>();
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null);
  
  // Loading & Processing state
  const [isUploading, setIsUploading] = useState(false);
  const [processingStep, setProcessingStep] = useState<'uploading' | 'parsing' | 'analyzing' | 'building'>('uploading');
  const [processingFilename, setProcessingFilename] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal States
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceType, setEvidenceType] = useState<'Requirement' | 'Action Item' | 'Risk' | 'Question'>('Action Item');
  const [currentEvidence, setCurrentEvidence] = useState<SourceReference | null>(null);

  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [highlightText, setHighlightText] = useState<string | undefined>(undefined);
  const [highlightPage, setHighlightPage] = useState<number | undefined>(undefined);

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
    setProcessingFilename(file.name);
    setProcessingStep('uploading');

    try {
      setProcessingStep('parsing');
      const doc = await api.uploadDocument(file);
      setDocuments(prev => [doc, ...prev]);
      setSelectedDocId(doc.id);

      setProcessingStep('analyzing');
      const analysis = await api.analyzeDocument(doc.id);

      setProcessingStep('building');
      setCurrentAnalysis(analysis);
      setIsUploading(false);

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

  const selectedDocument = documents.find(d => d.id === selectedDocId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Navigation */}
      <Navbar
        documents={documents}
        selectedDocId={selectedDocId}
        onSelectDoc={(id) => loadDocumentAnalysis(id)}
        onNewUpload={() => {
          setSelectedDocId(undefined);
          setCurrentAnalysis(null);
        }}
      />

      {/* Main Content Body */}
      <main className="flex-1 pb-16">
        
        {/* Error Notification Banner */}
        {errorMsg && (
          <div className="max-w-4xl mx-auto my-4 px-4">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={() => setErrorMsg(null)}
                className="p-1 hover:bg-rose-500/20 rounded-md transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* View 1: Processing / Scanner Loader */}
        {isUploading ? (
          <ProcessingState filename={processingFilename} step={processingStep} />
        ) : currentAnalysis && selectedDocument ? (
          /* View 2: Analysis Dashboard */
          <AnalysisDashboard
            document={selectedDocument}
            analysis={currentAnalysis}
            onToggleAction={handleToggleAction}
            onProveIt={handleProveIt}
            onViewDocumentFile={() => {
              setHighlightText(undefined);
              setHighlightPage(undefined);
              setViewerModalOpen(true);
            }}
          />
        ) : (
          /* View 3: Landing / Hero & Upload Zone */
          <div className="space-y-4">
            <Hero
              onStartUpload={() => window.scrollTo({ top: 300, behavior: 'smooth' })}
              onTrySample={handleTrySample}
            />
            <UploadZone
              onFileUpload={handleFileUpload}
              onTrySample={handleTrySample}
              isLoading={isUploading}
            />
          </div>
        )}

      </main>

      {/* Modals */}
      <EvidenceModal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        itemTitle={evidenceTitle}
        itemType={evidenceType}
        evidence={currentEvidence}
        documentFilename={selectedDocument?.filename || 'Uploaded Document'}
        onHighlightInFile={handleHighlightInFile}
      />

      <DocumentViewerModal
        isOpen={viewerModalOpen}
        onClose={() => setViewerModalOpen(false)}
        document={selectedDocument || null}
        highlightText={highlightText}
        pageNumber={highlightPage}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>ContextLens • Hackathon Prototype • Powered by Gemma 4 Intelligence</p>
      </footer>

    </div>
  );
}
export default App;
