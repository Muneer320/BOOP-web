# BOOP Backend API

FastAPI backend for the BOOP Word Search Puzzle Generator.

## API Endpoints

### `GET /` — Health check
Returns the API status.

### `GET /settings` — App settings
Returns configurable limits (max puzzles, grid sizes, etc.).

### `GET /templates` — Available templates
List of puzzle templates for cover/background.

### `GET /topics` — Word topics
Returns available word categories.

### `GET /topics/{topic}/words` — Words for a topic
Returns the word list for a given topic.

### `POST /upload` — File upload
Upload images or word files (max 10 MB). Returns a `file_id`.
- Multipart form with field `file`.

### `GET /files/{file_id}` — Retrieve uploaded file

### `DELETE /files/{file_id}` — Delete uploaded file

### `POST /generate-puzzle` — Generate puzzle book
Generates a PDF puzzle book. Request body:
```json
{
  "name": "My Puzzle",
  "normal": 5,
  "hard": 2,
  "bonus_normal": 1,
  "bonus_hard": 1,
  "cover_id": null,
  "background_id": null,
  "puzzle_bg_id": null,
  "words_payload": null,
  "words_file_id": null
}
```
Returns the PDF as `application/octet-stream`.

## Configuration

| Env Variable | Default | Description |
|---|---|---|
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated allowed origins |

## Running

```bash
pip install -r requirements.txt
uvicorn app:app --reload
```

## Project Structure

```
Backend/
├── app.py                 # FastAPI entry point
├── requirements.txt       # Python dependencies
├── routers/               # API route modules
│   ├── files.py
│   ├── generate.py
│   ├── settings.py
│   ├── status.py
│   ├── templates.py
│   └── words.py
├── boop/                  # Core puzzle logic
│   ├── generatePuzzle.py  # Word search generation
│   ├── appendImage.py     # PDF assembly
│   ├── rawWordToJSON.py   # Word data processing
│   └── main.py            # CLI entry point
├── uploads/               # Temporary file storage
└── outputs/               # Generated PDFs
```
