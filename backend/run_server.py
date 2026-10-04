import os
import sys
import argparse
import uvicorn

def main():
    parser = argparse.ArgumentParser(description="Run ContextLens FastAPI Server")
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORT", 8000)), help="Port to bind server")
    parser.add_argument("--host", type=str, default="127.0.0.1", help="Host address to bind")
    args = parser.parse_args()

    print(f"Starting ContextLens Backend Server on http://{args.host}:{args.port}...")
    uvicorn.run("app.main:app", host=args.host, port=args.port, reload=True)

if __name__ == "__main__":
    main()
