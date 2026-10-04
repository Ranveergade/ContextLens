# ContextLens: AI Document Intelligence and Actionable Workspace

"Understand everything. Act on what matters."

ContextLens is a hackathon-ready, production-quality full-stack application that transforms complex documents (PDFs, Excel spreadsheets, images, text files) into a structured, actionable workspace with verifiable "PROVE IT" source evidence traceability.

---
## live deployment:-

link:- https://contextlens-liart.vercel.app/


## 1. Project Overview

### Problem
Traditional AI summarizers generate static text bullets without verification. Users cannot easily check whether an AI model hallucinated deadlines, numbers, or requirements, introducing operational risk when working with legal contracts, project specifications, and hackathon guidelines.

### Solution
ContextLens provides an interactive, persistent document intelligence platform:
1. Gemma 4 AI Understanding: Extracts structured facts, requirements, action items, explicit deadlines, risks, and open questions.
2. PROVE IT Evidence Traceability: Every AI claim is mapped to the exact page number and verbatim quote in the original source document.
3. Verbatim Passage Highlighting: Clicking "PROVE IT" -> "Highlight In Document" opens the document text viewer, auto-scrolls to the line, and wraps the quote in a glowing highlight tag.
4. Persistent Task Manager: Action items feature completion checkboxes that persist in SQLite/PostgreSQL across browser reloads.

---

## 2. User Interface Panels and Screenshots

### Overview Panel
The Overview panel displays high-level executive summaries, four key metric cards (Action Items, Requirements, Risks Flagged, Open Questions), and priority task previews.



---

### Documents Panel
The Documents panel includes a drag-and-drop file upload zone supporting PDF, Excel (.xlsx/.xls), PNG, JPG, and TXT files, alongside a list of uploaded documents.



---

### Analysis Dashboard Panel
The Analysis Dashboard panel provides a comprehensive workspace featuring completion progress tracking, executive summaries, document metadata, and tabbed view controls.



---

### Action Items Panel
The Action Items panel renders an interactive task manager where users can check off completed tasks, view priority levels (High, Medium), see deadline timestamps, and trigger PROVE IT evidence inspection.



---

### Evidence Explorer and PROVE IT Inspector Panel
The Evidence Explorer panel and PROVE IT modal dialog display exact page number citations, verbatim quoted passages, and an interactive button to highlight passages inside the original file.



---

## 3. Architecture and Technical Stack

### Technical Stack
- Frontend: React 19, Vite, TypeScript, Tailwind CSS v4, Lucide Icons, Motion, Lenis smooth scroll.
- Backend: Python 3.14, FastAPI, Pydantic v2 Settings & Schemas, SQLAlchemy 2.0.
- Database: SQLite (sqlite:///./contextlens.db) with automatic table creation.
- Document Parsers: pdfplumber, PyPDF2, pandas, openpyxl, Pillow.
- AI Layer: google-genai SDK / Groq API (llama-3.1-8b-instant / gemini-2.5-flash) with JSON schema validation and rule-based fallback engine.

### Global Layout Specification
- Navbar: Full width, fixed at top, 64px height.
- Sidebar: Left side, 20 percent width (min 240px, max 320px).
- Content Area: Right side, 80 percent width, changes based on active menu selection.

---

## 4. Gemma 4 AI Integration

ContextLens uses Gemma 4 as its document understanding model:
- Structured Output Schema: Pydantic schema validation ensures outputs strictly match GemmaAnalysisOutput.
- Anti-Hallucination Guardrails: Prompt instructions mandate verbatim citations and page references without synthetic facts.
- Multi-Provider Support: Routes requests to Groq API or Google GenAI API, with an automated fallback extraction engine.

---

## 5. Environment Variables

Create a .env file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
GEMMA_MODEL=llama-3.1-8b-instant
DATABASE_URL=sqlite:///./contextlens.db
UPLOAD_DIR=./uploads
CORS_ORIGINS=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://localhost:8000", "http://localhost:8001"]
```

---

## 6. How to Run the Project

### Start Backend Server
```bash
cd backend
python run_server.py --port 8000
```
Backend API will run at http://localhost:8000 (Swagger docs at http://localhost:8000/docs).

### Start Frontend Application
```bash
cd frontend
npm run dev
```
Frontend Web Application will run at http://localhost:5173.

---

## 7. API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /api/documents | Upload document file (PDF, PNG, JPG, TXT, XLSX, XLS) |
| GET | /api/documents | List all uploaded documents |
| GET | /api/documents/{id} | Get document metadata |
| GET | /api/documents/{id}/text | Get extracted page text blocks |
| POST | /api/documents/{id}/analyze | Trigger Gemma 4 document analysis |
| GET | /api/documents/{id}/analysis | Retrieve complete structured analysis |
| GET | /api/documents/{id}/actions | Retrieve action items list |
| PATCH | /api/actions/{action_id} | Update action completion status |
| GET | /api/actions/{action_id}/evidence | Fetch PROVE IT verbatim source evidence |

---

## 8. Automated Testing

### Backend E2E Test
```bash
python backend/test_e2e.py
```

### Excel Pipeline Test
```bash
python backend/test_excel.py
```

### Frontend Build Test
```bash
cd frontend
npm run build
```

---

## 9. 90-Second Hackathon Judging Script

1. Open Application: Open http://localhost:5173 to view the sidebar layout.
2. Load Document: Click "Load Hackathon Sample Specification" in the Documents panel.
3. Observe Scanner: View multi-step progress in the scanning loader.
4. Inspect Analysis: Review Executive Summary, Requirements, Timeline, and Action Items.
5. Click PROVE IT: Click PROVE IT on an action item to open the Evidence modal.
6. Highlight in File: Click "Highlight In Document" to see the quote highlighted in yellow in the text viewer.
7. Verify Persistence: Check off an action item and refresh the browser page to confirm database persistence.