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
- `GET /api/settings` — App settings
- `GET /api/templates` — Available templates
- `GET /api/topics` — Word topics
- `POST /api/generate-puzzle` — Generate puzzle book PDF
- `POST /api/upload` — File upload
- `GET /api/files/{file_id}` — Retrieve uploaded file
- `DELETE /api/files/{file_id}` — Delete uploaded file

Built with FastAPI · Source: [github.com/muneer320/BOOP-web](https://github.com/muneer320/BOOP-web)
