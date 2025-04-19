from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import generate, files, templates, status, settings, words

app = FastAPI(
    title="BOOP Puzzle API",
    version="1.0.0"
)

# CORS configuration
origins = ["*"]  # Allow all origins; will restrict in production
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