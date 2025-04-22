# Roadmap & Future Requirements

This document outlines planned enhancements, architectural improvements, and desired capabilities for the BOOP Web API. It serves as a guide for contributors and future development.

## 0. Critical Requirement: Concurrency & Parallelism

- Implement a system to handle concurrent generation requests from multiple users.
- If multiple users request generation simultaneously, put them in a queue and generate one after another.
- However, once a generation is complete, make the generated file available for download immediately, regardless of the status of other requests in the queue.
- This will prevent users from having to wait for the combined generation time of all requests in the queue.

## 1. Security & Access Control

- ~~Implement CORS policy (allowed origins) for frontend integration.~~
- Add authentication/authorization (API key or JWT) for protected endpoints.
- Validate and sanitize all inputs to prevent injection attacks.

## 2. Upload & Asset Handling

- Enforce max file size limits and image dimensions.
- Add automatic resizing or format conversion for uploaded assets.
- Support versioning of uploaded files and cleanup of stale assets.

## 3. Puzzle Generation Enhancements

- Allow custom grid sizes and mask shapes via API parameters.
- Expose endpoint for individual puzzle SVG/PNG export.

## 4. Performance & Scalability

- Refactor temp directory management to avoid collisions in concurrent requests.
- Add caching layer for repeated word list and template requests.
- Introduce rate limiting to prevent abuse.

## 5. Monitoring & Logging

- Integrate structured logging (e.g., using `logging` module).
- Expose Prometheus metrics endpoint for API usage and errors.
- Implement global exception handling with standardized JSON responses.

## 6. Testing & CI/CD

- Write unit and integration tests (pytest + HTTPX) for all routes.
- Configure GitHub Actions or CI pipeline for linting, tests, and code coverage.
- Prepare Dockerfile and container deployment scripts.

## 7. Internationalization & Theming

- Allow custom fonts and multilingual support in puzzles.
- Expose theme customization (colors, fonts) via API parameters.

---

_Feel free to propose additional features or updates via pull requests._
