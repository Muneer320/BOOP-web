# BOOP Backend API

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)](Dockerfile)
[![HF Space](https://img.shields.io/badge/HuggingFace-Space-FFD21E?logo=huggingface&logoColor=black)](https://huggingface.co/spaces/muneer320/BOOP-backend)

FastAPI backend powering the BOOP Word Search Puzzle Generator. Handles puzzle generation, file management, and PDF book assembly.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/status` | Health check |
| GET | `/api/settings` | Grid sizes and word limits used by the book generator |
| GET | `/api/templates` | Bundled cover/background images |
| GET | `/api/templates/{template_id}` | One bundled image |
| GET | `/api/topics` | Word topic categories |
| GET | `/api/topics/{topic}/words` | Words for a topic |
| POST | `/api/upload` | Upload an image or `.txt` word list (multipart). Returns a random file id |
| GET | `/api/files/{file_id}` | Fetch one uploaded file by id |
| DELETE | `/api/files/{file_id}` | Delete one uploaded file by id |
| POST | `/api/generate-puzzle` | Generate a puzzle book PDF |
| GET | `/api/generation-progress/{session_id}` | Progress of a running generation |
| POST | `/api/play/generate` | Generate a single puzzle for interactive play |

There is no endpoint that lists uploaded files. File ids are random UUIDs.

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

Pass `?session_id=<id>` (letters, digits, `-`, `_`) to follow progress through
`/api/generation-progress/{session_id}`.

Normal puzzles use a 13×13 grid and Hard puzzles 17×17. Bonus puzzles use the
same sizes with a circular mask. If a puzzle's words do not fit, the generator
retries with new layouts and then grows the grid by up to 4 cells.

**Responses:**

- `200` with the PDF (`application/octet-stream`)
- `400` for an invalid session id or file id
- `422` when a topic has too few words, or some words could not be fitted (the message names the puzzles)

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

## Play Mode Presets

Used by `/api/play/generate`. `min_words`/`max_words` limit how many words can be sent.

| Mode | Grid | Min Words | Max Words | Backwards | Mask |
|------|------|-----------|-----------|-----------|------|
| `easy` | 10 | 7 | 12 | No | — |
| `normal` | 13 | 10 | 15 | Yes | — |
| `hard` | 15 | 13 | 20 | Yes | — |
| `veryhard` | 18 | 15 | 25 | Yes | — |
| `nightmare` | 20 | 18 | 30 | Yes | — |
| `bonus` | 15 | 7 | 15 | Yes | Circle |

## Local Development

```bash
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload       # → http://localhost:8000
```

Run the tests with `pip install pytest httpx && pytest`.

The server keeps generation progress in memory, so it runs with a single
uvicorn worker (see the Dockerfile). Each book is generated in a thread pool,
so one worker still builds several books at once.

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
├── file_ids.py             # Validation for uploaded file ids
├── routers/                # API route handlers
│   ├── files.py            # Upload / fetch / delete one file by id
│   ├── generate.py         # Puzzle book generation (long-running)
│   ├── play.py             # Single-puzzle generation (play mode)
│   ├── settings.py         # App settings endpoint
│   ├── status.py           # Health check endpoint
│   ├── templates.py        # Asset template listing
│   └── words.py            # Word topics & words
├── tests/                  # pytest suite
├── uploads/                # Uploaded files (gitignored)
└── outputs/                # Per-request working directories, removed after each book (gitignored)
```

## Deployment

The backend is deployed to Hugging Face Spaces using Docker. See the [CI/CD workflow](../.github/workflows/deploy.yml) for details.

```bash
docker build -t boop-backend .
docker run -p 7860:7860 boop-backend
```
