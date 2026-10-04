import os
import pandas as pd
from fastapi.testclient import TestClient
from app.db.database import init_db
from app.main import app

def test_excel_pipeline():
    print("Testing Excel (.xlsx) file processing pipeline...")
    init_db()
    client = TestClient(app)

    # 1. Create a synthetic test Excel spreadsheet
    excel_file_path = os.path.join(os.path.dirname(__file__), "test_sample.xlsx")
    df_reqs = pd.DataFrame({
        "ID": ["REQ-101", "REQ-102"],
        "Title": ["Automated Data Backup", "Multi-factor Authentication"],
        "Description": ["System must execute automated daily database backups.", "Require MFA for admin user accounts."]
    })
    df_tasks = pd.DataFrame({
        "Task": ["Deploy AWS RDS", "Setup OAuth Server"],
        "Assignee": ["Alice", "Bob"],
        "Priority": ["high", "medium"],
        "Deadline": ["May 20, 2026", "May 22, 2026"]
    })

    with pd.ExcelWriter(excel_file_path, engine="openpyxl") as writer:
        df_reqs.to_excel(writer, sheet_name="Requirements", index=False)
        df_tasks.to_excel(writer, sheet_name="Tasks", index=False)

    # 2. Upload Excel document
    with open(excel_file_path, "rb") as f:
        res = client.post(
            "/api/documents",
            files={"file": ("test_sample.xlsx", f, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")}
        )
    assert res.status_code == 201, f"Excel Upload failed: {res.text}"
    doc_data = res.json()
    doc_id = doc_data["id"]
    print(f"[PASSED] Excel Upload API (Document ID: {doc_id})")

    # 3. Analyze Excel document
    res = client.post(f"/api/documents/{doc_id}/analyze")
    assert res.status_code == 200, f"Excel Analysis failed: {res.text}"
    analysis = res.json()

    print(f"[PASSED] Excel Document AI Analysis")
    print(f"  - Summary: {analysis['summary'][:100]}...")
    print(f"  - Requirements extracted: {len(analysis['requirements'])}")
    print(f"  - Action items extracted: {len(analysis['action_items'])}")

    # Cleanup temp file
    if os.path.exists(excel_file_path):
        os.remove(excel_file_path)

    print("==========================================")
    print("EXCEL PIPELINE TEST PASSED SUCCESSFULLY!")
    print("==========================================")

if __name__ == "__main__":
    test_excel_pipeline()
