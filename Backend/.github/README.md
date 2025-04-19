# BOOP Web API

This API serves as the backend for the BOOP word search web application, powering the frontend UI and allowing users to generate customizable puzzle books without any command‑line interaction. All endpoints under `/api` are consumed by the frontend.

## Overview of Endpoints

### Health Check
- **GET** `/api/status`
  - Returns `{ "status": "ok" }` to confirm the service is running.

### Configuration
- **GET** `/api/settings`
  - Provides frontend with available options:
    - Difficulty levels (`Normal`, `Hard`)
    - Bonus modes (`Normal`, `Hard`)
    - Default puzzle counts
    - Mask types (`circle`, `squares`, or none)
    - Grid sizes by difficulty

### Templates
- **GET** `/api/templates`
  - Returns list of built‑in template assets (backgrounds, covers).
- **GET** `/api/templates/{template_id}`
  - Streams a specific template image for preview or display.

### Assets Management
- **POST** `/api/upload`
  - Accepts image or text file uploads (`multipart/form-data`).
  - Returns `{ "file_id": "<uuid>.<ext>" }`.
  - Used by frontend to upload custom covers, backgrounds, or word lists.
- **GET** `/api/files/{file_id}`
  - Streams back the uploaded file for preview or processing.
- **DELETE** `/api/files/{file_id}`
  - Removes an uploaded asset by its ID.

### Word Topics
- **GET** `/api/topics`
  - Lists default word topics derived from the raw word list.
- **GET** `/api/topics/{topic}/words`
  - Retrieves words array for a specific topic, used to prefill selection lists.

### Puzzle Book Generation
- **POST** `/api/generate-puzzle`
  - Primary endpoint for creating the puzzle book.
  - Request body (JSON) may include:
    - `name`: Title of the book (string).
    - `normal`, `hard`, `bonus_normal`, `bonus_hard`: Puzzle counts (integers).
    - `cover_id`, `background_id`, `puzzle_bg_id`: Optional file IDs for custom assets.
    - `words_payload`: Inline JSON of topics and custom word arrays.
    - `words_file_id`: ID of uploaded text file containing a single topic list.
  - Returns the generated PDF as an attachment (`Content-Disposition: attachment; filename="{name}.pdf"`).
  - Frontend should download and present the PDF directly to the user.

## Integration Notes
- All asset and word uploads should be performed before calling the generate endpoint.
- The frontend controls puzzle parameters and passes them as JSON; no CLI is required.
- Interactive documentation is available at `/docs` (Swagger UI) and `/redoc`.

## Docker
- **Build Image**
  ```bash
  docker build -t boop-web-backend .
  ```
- **Run Container**
  ```bash
  docker run --rm -p 7860:7860 boop-web-backend
  ```
  The API will be available at `http://localhost:7860` (e.g. `http://localhost:7860/api/status`).

*For Hugging Face Spaces deployment, ensure the container listens on port 7860 as required.*

## Contributing

Contributions are welcome! If you'd like to contribute to the BOOP API:

1. Clone the repository.
2. Run `pip install -r requirements.txt` to set up the environment.
3. Create a new branch or fork the repository.
4. Make your changes, following the existing code style.
5. Add tests (if applicable) to ensure your changes don't break anything.
6. Open a pull request against the `main` branch.
7. See [Roadmap & Future Requirements](FUTURE_REQUIREMENTS.md) for some planned enhancements and contribution ideas.

---
Generated and maintained by the BOOP development team.
