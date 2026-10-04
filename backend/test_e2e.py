import sys
import os
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.db.database import init_db
from app.main import app

def run_e2e_tests():
    print("==========================================")
    print("STARTING BACKEND END-TO-END INTEGRATION TEST")
    print("==========================================")
    
    init_db()
    client = TestClient(app)
    
    # 1. Health check
    res = client.get("/api/health")
    assert res.status_code == 200, f"Health check failed: {res.text}"
    print("[PASSED] Health Check API")
    
    # 2. Upload document
    sample_file_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "sample_hackathon_spec.txt")
    with open(sample_file_path, "rb") as f:
        response = client.post(
            "/api/documents",
            files={"file": ("sample_hackathon_spec.txt", f, "text/plain")}
        )
    assert response.status_code == 201, f"Upload failed: {response.text}"
    doc_data = response.json()
    doc_id = doc_data["id"]
    print(f"[PASSED] Document Upload API (Document ID: {doc_id})")
    
    # 3. Analyze document
    response = client.post(f"/api/documents/{doc_id}/analyze")
    assert response.status_code == 200, f"Analysis failed: {response.text}"
    analysis = response.json()
    
    assert analysis["summary"], "Summary missing from analysis"
    assert len(analysis["requirements"]) > 0, "No requirements extracted"
    assert len(analysis["action_items"]) > 0, "No action items extracted"
    assert len(analysis["risks"]) > 0, "No risks extracted"
    assert len(analysis["questions"]) > 0, "No questions extracted"
    
    print(f"[PASSED] Gemma AI Document Analysis API")
    print(f"  - Summary: {analysis['summary'][:100]}...")
    print(f"  - Requirements extracted: {len(analysis['requirements'])}")
    print(f"  - Action items extracted: {len(analysis['action_items'])}")
    print(f"  - Risks extracted: {len(analysis['risks'])}")
    print(f"  - Questions extracted: {len(analysis['questions'])}")
    
    # 4. Check action items & source evidence ("PROVE IT")
    first_action = analysis["action_items"][0]
    action_id = first_action["id"]
    assert first_action["completed"] is False, "Default action item completed state should be False"
    
    response = client.get(f"/api/actions/{action_id}/evidence")
    assert response.status_code == 200, f"Evidence fetch failed: {response.text}"
    evidence_data = response.json()
    assert "page" in evidence_data, "Page number missing in evidence"
    assert "text" in evidence_data, "Text missing in evidence"
    print(f"[PASSED] 'PROVE IT' Evidence Retrieval API for Action {action_id}")
    print(f"  - Page: {evidence_data.get('page')}")
    print(f"  - Verbatim Text Snippet: '{evidence_data.get('text')[:90]}...'")
    
    # 5. Toggle completion status
    response = client.patch(f"/api/actions/{action_id}", json={"completed": True})
    assert response.status_code == 200, f"Action update failed: {response.text}"
    updated_action = response.json()
    assert updated_action["completed"] is True, "Action completed status failed to update"
    print(f"[PASSED] Action Completion Update API")
    
    # 6. Verify persistence via GET /api/documents/{doc_id}/analysis
    response = client.get(f"/api/documents/{doc_id}/analysis")
    assert response.status_code == 200, f"Analysis get failed: {response.text}"
    persisted_analysis = response.json()
    persisted_action = next(a for a in persisted_analysis["action_items"] if a["id"] == action_id)
    assert persisted_action["completed"] is True, "Action completion state did not persist in DB"
    print(f"[PASSED] Database State Persistence Verification after Refresh")
    
    print("==========================================")
    print("ALL BACKEND END-TO-END TESTS PASSED SUCCESSFULLY!")
    print("==========================================")

if __name__ == "__main__":
    run_e2e_tests()
