---
title: BOOP Backend
emoji: 🧩
colorFrom: indigo
colorTo: blue
sdk: docker
pinned: false
---

# BOOP Backend API

FastAPI backend for the BOOP Word Search Puzzle Generator.

## API Endpoints

- `GET /api/status` — Health check
- `GET /api/settings` — Generator grid sizes and word limits
- `GET /api/templates` — Bundled images
- `GET /api/topics` — Word topics
- `POST /api/upload` — Upload an image or word list
- `GET|DELETE /api/files/{file_id}` — One uploaded file by id
- `POST /api/generate-puzzle` — Generate a puzzle book PDF
- `GET /api/generation-progress/{session_id}` — Generation progress
- `POST /api/play/generate` — One puzzle for the in-browser game

Built with FastAPI · Source: [github.com/muneer320/BOOP-web](https://github.com/muneer320/BOOP-web)
