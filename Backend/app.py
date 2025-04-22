from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import generate, files, templates, status, settings, words
import os
import threading
import time
from datetime import datetime, timedelta

# Directory for cleanup of old uploads
dirs = os.path.join(os.path.dirname(__file__), 'uploads')
UPLOAD_CLEANUP_DIR = dirs

def cleanup_uploads(interval_hours: int = 12, max_age_hours: int = 12):
    while True:
        now = datetime.now()
        cutoff = now - timedelta(hours=max_age_hours)
        for filename in os.listdir(UPLOAD_CLEANUP_DIR):
            filepath = os.path.join(UPLOAD_CLEANUP_DIR, filename)
            if os.path.isfile(filepath):
                mtime = datetime.fromtimestamp(os.path.getmtime(filepath))
                if mtime < cutoff:
                    try:
                        os.remove(filepath)
                    except Exception:
                        pass
        time.sleep(interval_hours * 3600)

app = FastAPI(
    title="BOOP Puzzle API",
    version="1.0.0"
)

@app.on_event("startup")
def start_cleanup_task():
    thread = threading.Thread(target=cleanup_uploads, daemon=True)
    thread.start()

# CORS configuration
origins = ["https://boop-web.vercel.app/", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(status.router, prefix="/api")
app.include_router(settings.router, prefix="/api")
app.include_router(templates.router, prefix="/api")
app.include_router(files.router, prefix="/api")
app.include_router(generate.router, prefix="/api")
app.include_router(words.router, prefix="/api")

# Run it with: uvicorn app:app --reload