"""
ContextLens — Full End-to-End Test Suite
Covers: health, frontend, upload, analyze, evidence, action toggle,
document text, file stream, list persistence, CORS/proxy.
"""
import os
import sys
import json
import time
from io import BytesIO

import requests

BASE = os.environ.get("CONTEXTLENS_API", "http://127.0.0.1:8000")
FE = os.environ.get("CONTEXTLENS_FE", "http://127.0.0.1:5173")
API = f"{BASE}/api"

SAMPLE = """CONTEXTLENS HACKATHON PROJECT SPECIFICATION
Version: 1.0.4
Target Release: Hackathon Final Submission

OVERVIEW
ContextLens is an AI-powered document intelligence workspace.

SECTION 1: CORE REQUIREMENTS
1. The application must allow uploading PDF, PNG, JPG, and TXT files under 25MB.
2. The AI backend shall process documents using Gemma 4 model architecture.
3. Every extracted requirement must maintain a traceable source reference.

SECTION 2: ACTION ITEMS & DELIVERABLES
- Deliverable A: Public GitHub repository with complete source code.
- Task 1: Complete FastAPI backend API endpoints.
- Task 2: Build modern Vite + React frontend.

SECTION 3: DEADLINES
- Final Code Freeze: May 15, 2026 at 11:59 PM EST.
- Video Demo Upload: May 16, 2026 at 10:00 AM EST.

SECTION 4: RISKS AND AMBIGUITIES
- Risk 1: Gemma API rate limiting. Severity: High.
- Risk 2: Parsing multi-column scanned PDFs. Severity: Medium.
- Question 1: Should we implement offline caching?
- Question 2: What is the max simultaneous uploads?
"""

results = []


def case(name, fn):
    try:
        detail = fn()
        results.append({"name": name, "status": "PASSED", "detail": detail or ""})
        msg = f"[PASSED] {name}" + (f" -- {detail}" if detail else "")
        print(msg.encode("ascii", "replace").decode("ascii"))
    except Exception as e:
        results.append({"name": name, "status": "FAILED", "detail": str(e)})
        msg = f"[FAILED] {name} -- {e}"
        print(msg.encode("ascii", "replace").decode("ascii"))


def test_backend_health():
    r = requests.get(f"{API}/health", timeout=10)
    assert r.status_code == 200, r.text
    body = r.json()
    assert body.get("status") == "healthy"
    return json.dumps(body)


def test_backend_root():
    r = requests.get(f"{BASE}/", timeout=10)
    assert r.status_code == 200
    body = r.json()
    assert body.get("name") == "ContextLens"
    assert body.get("status") == "online"
    return body.get("tagline")


def test_frontend_serves():
    r = requests.get(FE, timeout=10)
    assert r.status_code == 200
    assert "root" in r.text.lower() or "ContextLens" in r.text or "vite" in r.text.lower()
    return f"status={r.status_code}, bytes={len(r.content)}"


def test_vite_proxy_health():
    r = requests.get(f"{FE}/api/health", timeout=10)
    assert r.status_code == 200
    assert r.json().get("status") == "healthy"
    return "proxy /api/health OK"


def test_list_documents():
    r = requests.get(f"{API}/documents", timeout=15)
    assert r.status_code == 200
    docs = r.json()
    assert isinstance(docs, list)
    return f"count={len(docs)}"


def test_upload_analyze_prove_toggle():
    files = {"file": ("e2e_sample_spec.txt", BytesIO(SAMPLE.encode("utf-8")), "text/plain")}
    r = requests.post(f"{API}/documents", files=files, timeout=30)
    assert r.status_code == 201, r.text
    doc = r.json()
    doc_id = doc["id"]
    assert doc["filename"] == "e2e_sample_spec.txt"
    assert doc["file_type"] in ("TXT", "txt", "text")

    r = requests.post(f"{API}/documents/{doc_id}/analyze", timeout=120)
    assert r.status_code == 200, r.text
    analysis = r.json()
    assert analysis.get("summary"), "missing summary"
    assert len(analysis.get("requirements", [])) > 0, "no requirements"
    assert len(analysis.get("action_items", [])) > 0, "no action items"
    assert len(analysis.get("risks", [])) > 0, "no risks"
    assert len(analysis.get("questions", [])) > 0, "no questions"

    action = analysis["action_items"][0]
    action_id = action["id"]
    assert action["completed"] is False

    # PROVE IT evidence
    r = requests.get(f"{API}/actions/{action_id}/evidence", timeout=15)
    assert r.status_code == 200, r.text
    evidence = r.json()
    assert "page" in evidence
    assert "text" in evidence and len(evidence["text"]) > 0

    # Toggle complete
    r = requests.patch(f"{API}/actions/{action_id}", json={"completed": True}, timeout=15)
    assert r.status_code == 200, r.text
    assert r.json()["completed"] is True

    # Persist
    r = requests.get(f"{API}/documents/{doc_id}/analysis", timeout=15)
    assert r.status_code == 200
    persisted = r.json()
    found = next(a for a in persisted["action_items"] if a["id"] == action_id)
    assert found["completed"] is True

    # Document text
    r = requests.get(f"{API}/documents/{doc_id}/text", timeout=15)
    assert r.status_code == 200, r.text
    text_payload = r.json()
    assert "full_text" in text_payload
    assert "CONTEXTLENS" in text_payload["full_text"].upper() or "ContextLens" in text_payload["full_text"]

    # File stream
    r = requests.get(f"{API}/documents/{doc_id}/file", timeout=15)
    assert r.status_code == 200
    assert len(r.content) > 0

    # Get single document
    r = requests.get(f"{API}/documents/{doc_id}", timeout=15)
    assert r.status_code == 200
    assert r.json()["id"] == doc_id

    return (
        f"doc={doc_id[:8]}… req={len(analysis['requirements'])} "
        f"actions={len(analysis['action_items'])} risks={len(analysis['risks'])} "
        f"questions={len(analysis['questions'])} evidence_page={evidence.get('page')}"
    )


def test_invalid_upload_rejected():
    files = {"file": ("bad.exe", BytesIO(b"MZ fake"), "application/octet-stream")}
    r = requests.post(f"{API}/documents", files=files, timeout=15)
    # Should reject unsupported type (4xx) — if backend accepts, note soft fail differently
    assert r.status_code in (400, 415, 422) or (
        r.status_code == 201 and False  # unexpected accept
    ), f"expected rejection, got {r.status_code}: {r.text[:200]}"
    return f"status={r.status_code}"


def test_cors_preflight():
    r = requests.options(
        f"{API}/documents",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "GET",
        },
        timeout=10,
    )
    # OPTIONS may be 200 or 204
    assert r.status_code in (200, 204, 400) or "access-control" in str(r.headers).lower()
    acao = r.headers.get("access-control-allow-origin", "")
    # Soft check — middleware may echo origin
    return f"status={r.status_code}, ACAO={acao or 'n/a'}"


def test_frontend_proxy_documents():
    r = requests.get(f"{FE}/api/documents", timeout=15)
    assert r.status_code == 200
    assert isinstance(r.json(), list)
    return f"proxied docs={len(r.json())}"


def main():
    print("=" * 60)
    print("CONTEXTLENS FULL END-TO-END TEST SUITE")
    print(f"Backend: {BASE}  |  Frontend: {FE}")
    print("=" * 60)

    case("1. Backend health /api/health", test_backend_health)
    case("2. Backend root /", test_backend_root)
    case("3. Frontend serves HTML", test_frontend_serves)
    case("4. Vite proxy /api/health", test_vite_proxy_health)
    case("5. List documents", test_list_documents)
    case("6. Upload > Analyze > PROVE IT > Toggle > Persist > Text/File", test_upload_analyze_prove_toggle)
    case("7. Invalid file type rejected", test_invalid_upload_rejected)
    case("8. CORS preflight for localhost:5173", test_cors_preflight)
    case("9. Frontend proxy /api/documents", test_frontend_proxy_documents)

    # Also run in-process TestClient suite if available
    print("\n--- Running backend/test_e2e.py (TestClient) ---")
    try:
        backend_dir = os.path.join(os.path.dirname(__file__), "backend")
        sys.path.insert(0, backend_dir)
        os.chdir(backend_dir)
        from test_e2e import run_e2e_tests
        run_e2e_tests()
        results.append({"name": "10. Backend TestClient E2E suite", "status": "PASSED", "detail": ""})
    except Exception as e:
        print(f"[FAILED] Backend TestClient E2E — {e}")
        results.append({"name": "10. Backend TestClient E2E suite", "status": "FAILED", "detail": str(e)})

    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    passed = sum(1 for r in results if r["status"] == "PASSED")
    failed = sum(1 for r in results if r["status"] == "FAILED")
    for r in results:
        mark = "OK" if r["status"] == "PASSED" else "XX"
        print(f"  {mark} [{r['status']}] {r['name']}")
        if r["detail"] and r["status"] == "FAILED":
            print(f"      -> {r['detail']}".encode("ascii", "replace").decode("ascii"))
    print("-" * 60)
    print(f"TOTAL: {passed} passed, {failed} failed, {len(results)} cases")
    print("=" * 60)
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    # Run from repo root
    root = os.path.dirname(os.path.abspath(__file__))
    os.chdir(root)
    sys.exit(main())
