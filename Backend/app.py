from fastapi import FastAPI
from routers import generate, files, templates, status, settings, words

app = FastAPI(
    title="BOOP Puzzle API",
    version="1.0.0"
)

app.include_router(status.router, prefix="/api")
app.include_router(settings.router, prefix="/api")
app.include_router(templates.router, prefix="/api")
app.include_router(files.router, prefix="/api")
app.include_router(generate.router, prefix="/api")
app.include_router(words.router, prefix="/api")

# Run it with: uvicorn app:app --reload