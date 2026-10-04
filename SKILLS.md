ContextLens — Skills and Capabilities Manifest

This document defines the complete skill set, architecture rules, and design system for ContextLens. Any AI agent or developer working on this project MUST follow these specifications.


1. PROJECT IDENTITY

Name: ContextLens
Tagline: Understand everything. Act on what matters.
Type: Document intelligence platform with verifiable AI extraction
Core Differentiator: PROVE IT evidence traceability — every AI output is backed by page number and verbatim quote


2. TECHNICAL STACK

Backend:
- Python 3.14
- FastAPI (async web framework)
- Pydantic v2 (validation and settings)
- SQLAlchemy 2.0 (ORM)
- SQLite (dev) / PostgreSQL-ready
- pdfplumber, PyPDF2 (PDF parsing)
- pandas, openpyxl (Excel parsing)
- Pillow (image handling)

AI Layer:
- Google GenAI SDK v1.58 (Gemma 4 primary)
- Groq API (llama-3.3-70b fallback)
- Deterministic rule-based extractor (final fallback)
- Strict JSON schema validation via Pydantic

Frontend:
- React 19
- Vite
- TypeScript
- Tailwind CSS v4
- Lucide Icons
- Motion (Framer Motion successor)
- Lenis (smooth scroll)


3. UI/UX LAYOUT SPECIFICATION

Global Layout:

The application follows a strict three-zone layout:

- Navbar: full width, fixed at top, 64px height
- Sidebar: left side, 20 percent width (min 240px, max 320px)
- Content: right side, 80 percent width, changes based on selected menu


Navbar (Top):
- Full width, fixed at top
- Height: 64px
- White background with backdrop blur
- Bottom border: 1px solid light gray
- Left side: ContextLens logo (blue icon plus text)
- Center-left: Gemma 4 badge (light blue pill)
- Right side: document selector dropdown, settings icon, user avatar

Sidebar (Left):
- Width: 20 percent of viewport (min 240px, max 320px)
- Full height minus navbar
- White background, right border 1px light gray
- Menu items with icon and label:
  Overview, Documents, Analysis, Requirements, Action Items, Timeline, Risks, Open Questions, Evidence Explorer, Settings
- Active item: light blue background, blue left border 3px, blue text
- Hover: light slate background
- Smooth transition 200ms

Content Area (Right):
- Width: 80 percent of viewport
- Full height minus navbar
- Padding: 32px
- Background: white with subtle radial gradient
- Content changes based on selected menu item


4. DESIGN SYSTEM

Colors:
- Primary Blue: hash 3B82F6 — buttons, active states, links
- Light Blue: hash 60A5FA — hover states
- Blue Tint: hash DBEAFE — backgrounds, badges
- Blue Soft: hash EFF6FF — selected item background
- White: hash FFFFFF — base background
- Slate 50: hash F8FAFC — surface variant
- Slate 100: hash F1F5F9 — hover backgrounds
- Slate 900: hash 0F172A — primary text
- Slate 600: hash 475569 — secondary text
- Slate 400: hash 94A3B8 — muted text
- Border: hash E2E8F0 — dividers and borders
- Red: hash EF4444 — critical alerts, high risks
- Emerald: hash 10B981 — success, PROVE IT verified

Typography:
- Font family: Inter, system-ui, sans-serif
- Headings: font-semibold, slate-900
- Body: font-normal, slate-600
- Small labels: font-medium, slate-400, uppercase tracking-wide

Spacing:
- Section padding: 24px to 32px
- Card padding: 20px to 24px
- Gap between cards: 16px

Radius:
- Cards: 12px
- Buttons: 8px
- Badges: 6px
- Inputs: 8px

Shadows:
- Soft: 0 1px 3px rgba(0,0,0,0.04)
- Medium: 0 4px 12px rgba(0,0,0,0.06)
- Elevated: 0 10px 40px rgba(59,130,246,0.08)

Animations:
- Default duration: 200ms
- Easing: cubic-bezier(0.16, 1, 0.3, 1)
- Hover lift: translateY(-2px)
- Section reveals: fade and slide up, stagger 0.05s


5. FUNCTIONAL SKILLS

Document Processing:
- Accept: PDF, PNG, JPG, TXT, XLSX, XLS
- Max size: 25MB
- UUID-based safe filenames
- Excel sheets treated as pages

AI Analysis:
- Extract: summary, requirements, action items, timeline, risks, questions
- Every item includes evidence with page number and verbatim quote
- Three-layer anti-hallucination: strict prompt, schema validation, rule-based fallback

Evidence System (PROVE IT):
- Each extracted item has an evidence record
- Click shows modal with page number and quote
- Highlight button opens original document, quote glows, auto-scroll
- 100 percent traceability

Action Items:
- Interactive checkboxes
- State persists in database
- Survives browser refresh
- Completion animates with line-through and celebration


6. API CONTRACT

All endpoints under /api/:

POST /documents/upload — Upload file
GET /documents/ — List documents
GET /documents/{id} — Document detail
POST /documents/{id}/analyze — Run AI analysis
GET /documents/{id}/text — Get readable text
GET /documents/{id}/file — Serve original file
PATCH /actions/{id}/toggle — Toggle completion
GET /actions/{id}/evidence — Fetch evidence
GET /health — Health check


7. WORKFLOW RULES FOR AI AGENTS

When modifying this project:

1. Never break existing functionality. All current features must remain intact.
2. Follow the layout spec strictly. Navbar top, sidebar left 20 percent, content right 80 percent.
3. Use the design tokens. No hardcoded colors outside the palette.
4. Maintain API contract. Do not rename endpoints or change response shapes.
5. Preserve evidence system. PROVE IT traceability is the core differentiator.
6. Type-safe changes. All TypeScript types must remain valid.
7. Test after every change. Run npm run build and python -m pytest.
8. Component isolation. Each component owns its styles, no global pollution.
9. Accessibility. All interactive elements must have focus states and aria-labels.
10. Performance. Use transform and opacity animations, avoid layout thrashing.


8. FILE STRUCTURE

contextlens/
  backend/
    app/
      main.py
      core/config.py
      db/database.py
      models/models.py
      schemas/schemas.py
      services/
        document_service.py
        gemma_service.py
        analysis_service.py
      routes/
        documents.py
        actions.py
    run_server.py
    test_e2e.py
    test_excel.py
  frontend/
    src/
      App.tsx
      index.css
      types/index.ts
      services/api.ts
      components/
        Navbar.tsx
        Sidebar.tsx
        ContentArea.tsx
        views/
          OverviewView.tsx
          DocumentsView.tsx
          AnalysisView.tsx
          RequirementsView.tsx
          ActionItemsView.tsx
          TimelineView.tsx
          RisksView.tsx
          QuestionsView.tsx
          EvidenceView.tsx
          SettingsView.tsx
        Hero.tsx
        UploadZone.tsx
        ProcessingState.tsx
        EvidenceModal.tsx
        DocumentViewerModal.tsx
    package.json
  skills.md


9. QUALITY BAR

- Zero TypeScript errors
- Zero console warnings in production build
- All API calls handle errors gracefully
- Loading states for all async operations
- Empty states with helpful messages
- Mobile responsive with minimum 375px width
- Accessibility: WCAG AA contrast minimum
- Performance: Lighthouse score above 90


This manifest is the source of truth. Any deviation must be justified and approved.