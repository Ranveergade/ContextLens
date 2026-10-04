import requests

def test_live_server():
    print("Testing live backend server running at http://127.0.0.1:8000...")
    
    # Health check
    r = requests.get("http://127.0.0.1:8000/api/health")
    print(f"Health response: status={r.status_code}, body={r.json()}")
    assert r.status_code == 200
    
    # Root check
    r = requests.get("http://127.0.0.1:8000/")
    print(f"Root response: status={r.status_code}, body={r.json()}")
    assert r.status_code == 200
    
    print("LIVE BACKEND SERVER HEALTH CHECK PASSED!")

if __name__ == "__main__":
    test_live_server()
