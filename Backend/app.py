from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from routers import generate, files, templates, status, settings, words, play
import os
import threading
import time
from datetime import datetime, timedelta
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from limiter import limiter

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

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal error occurred. Please try again later."},
    )

@app.on_event("startup")
def start_cleanup_task():
    thread = threading.Thread(target=cleanup_uploads, daemon=True)
    thread.start()

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
origins = [o.strip() for o in CORS_ORIGINS]
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
app.include_router(play.router, prefix="/api")

@app.get("/api")
@app.get("/api/")
async def api_root():
    return {"status": "ok", "app": "BOOP Puzzle API", "version": "1.0.0"}

@app.get("/")
async def root_redirect():
    return RedirectResponse(url="/api")
