# BOOP Backend API

[![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)](Dockerfile)
[![HF Space](https://img.shields.io/badge/HuggingFace-Space-FFD21E?logo=huggingface&logoColor=black)](https://huggingface.co/spaces/muneer320/BOOP-backend)

FastAPI backend powering the BOOP Word Search Puzzle Generator. Handles puzzle generation, file management, and PDF book assembly.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/status` | Health check |
| GET | `/api/settings` | App configuration (limits, modes) |
| GET | `/api/templates` | Available cover/background templates |
| GET | `/api/topics` | Word topic categories |
| GET | `/api/topics/{topic}/words` | Words for a topic |
| POST | `/api/upload` | Upload a file (multipart) |
| GET | `/api/files/{file_id}` | Retrieve an uploaded file |
| DELETE | `/api/files/{file_id}` | Delete an uploaded file |
| POST | `/api/generate-puzzle` | Generate a multi-puzzle PDF book |
| POST | `/api/play/generate` | Generate a single puzzle for interactive play |

### POST `/api/generate-puzzle`

Generate a PDF puzzle book with multiple puzzles.

**Request body:**

```json
{
  "name": "My Puzzle Book",
  "normal": 5,
  "hard": 2,
  "bonus_normal": 1,
  "bonus_hard": 1,
  "cover_id": null,
  "background_id": null,
  "puzzle_bg_id": null,
  "words_payload": {"animals": ["cat", "dog"]},
  "words_file_id": null
}
```

**Response:** `application/octet-stream` (PDF file)

### POST `/api/play/generate`

Generate a single puzzle for the interactive play interface. Uses an adaptive fitting loop — tries to fit all words, then iteratively reduces the count until placement succeeds.

**Request body:**

```json
{
  "words": ["APPLE", "BANANA", "CHERRY"],
  "mode": "normal"
}
```

**Response:**

```json
{
  "grid": [["A", "B", ...], ...],
  "positions": {"APPLE": {"start": [0, 0], "end": [0, 4]}, ...},
  "cells_by_word": {"APPLE": [[0, 0], [0, 1], ...], ...},
  "words": ["APPLE", "BANANA"],
  "grid_size": 13,
  "mode": "normal"
}
```

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated allowed CORS origins |

## Mode Presets

| Mode | Grid | Min Words | Max Words | Backwards | Mask |
|------|------|-----------|-----------|-----------|------|
| Easy | 10 | 4 | 7 | No | — |
| Normal | 13 | 6 | 10 | Yes | — |
| Hard | 15 | 8 | 13 | Yes | — |
| Very Hard | 18 | 10 | 16 | Yes | — |
| Nightmare | 20 | 12 | 20 | Yes | — |
| Bonus | 15 | 6 | 11 | Yes | Circle |

## Local Development

```bash
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload       # → http://localhost:8000
```

## Project Structure

```text
Backend/
├── app.py                  # FastAPI application entry point
├── limiter.py              # Rate limit configuration (slowapi)
├── requirements.txt        # Python dependencies
├── Dockerfile              # HF Space Docker build
├── .dockerignore           # Docker build exclusions
├── boop/                   # Core puzzle engine
│   ├── generatePuzzle.py   # Word search grid algorithm
│   ├── appendImage.py      # PDF assembly & image embedding
│   ├── rawWordToJSON.py    # Word-list processing & sampling
│   └── Assets/             # Static cover & background images
├── routers/                # API route handlers
│   ├── files.py            # Upload / download / delete files
│   ├── generate.py         # Puzzle book generation (long-running)
│   ├── play.py             # Single-puzzle generation (play mode)
│   ├── settings.py         # App settings endpoint
│   ├── status.py           # Health check endpoint
│   ├── templates.py        # Asset template listing
│   └── words.py            # Word topics & words
├── uploads/                # Temporary uploaded files (gitignored)
└── outputs/                # Generated PDFs (gitignored)
```

## Deployment

The backend is deployed to Hugging Face Spaces using Docker. See the [CI/CD workflow](../.github/workflows/deploy.yml) for details.

```bash
docker build -t boop-backend .
docker run -p 7860:7860 boop-backend
```
