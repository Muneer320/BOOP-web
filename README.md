# BOOP Web

BOOP Web is a full‑stack word search puzzle generator, evolving from a CLI tool into a modern web application. It consists of:

- **Backend API:** A Python FastAPI service for puzzle generation and asset management.
- **Frontend UI:** A React app that provides an intuitive interface for users to easily configure, and download custom word-search puzzle books, making [BOOP](https://github.com/Muneer320/BOOP) more accessible and user-friendly than ever, from anywhere and at any time.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)

## Features

- Select difficulty levels, bonus modes, mask types, and grid sizes.
- Upload custom word lists, covers, and backgrounds.
- Live PDF puzzle preview and download.
- Responsive and accessible design.
- CLI‑free workflow for end users.

## Tech Stack

- **Backend:** Python, FastAPI.
- **Frontend:** React, Axios, React Router.
- **Deployment:** Vercel for frontend; Hugging Face with Docker SDK for backend.

## Prerequisites

- **Node.js** >= 16.x and npm or yarn.
- **Python** >= 3.9 and pip.

## Installation

1. Clone repository:
   ```bash
   git clone https://github.com/Muneer320/BOOP-web.git
   cd BOOP-web
   ```

2. Setup backend:
   ```bash
   cd Backend
   python -m venv venv
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   pip install -r requirements.txt
   ```

3. Setup frontend:
   ```bash
   cd ../frontend
   npm install  # or yarn install
   ```

## Running the Application

### Start Backend

```bash
cd Backend
uvicorn main:app --reload
```
Backend will run at `http://localhost:8000`.

### Start Frontend

```bash
cd frontend
npm start
```
Frontend will launch at `http://localhost:3000` and proxy API calls to the backend.

## Project Structure

```text
BOOP-web/
├── Backend/               # FastAPI backend
│   ├── boop/              # BOOP core logic
│   ├── output/            # Generated PDFs
│   ├── routers/           # API endpoints
│   ├── upload/            # Temporary file storage for uploads
│   ├── main.py            # API entry point
│   ├── requirements.txt   # Python dependencies
│   ├── README.md          # Backend docs
│   └── FUTURE_REQUIREMENTS.md
└── frontend/              # React frontend
    ├── src/               # Application source
    ├── public/            # Static assets
    ├── README.md          # Frontend docs
    └── FUTURE_REQUIREMENTS.md
```  

## API Documentation

For full details on endpoints, request/response schemas, and examples, see the [Backend README](./Backend/README.md).

## Contributing

Contributions are welcome! Please:

1. Fork the repo and create a feature branch.
2. Follow installation steps for local development.
3. Write tests for new features.
4. Submit a pull request to `main`.

See [Backend FUTURE_REQUIREMENTS.md](./Backend/FUTURE_REQUIREMENTS.md) and [Frontend FUTURE_REQUIREMENTS.md](./frontend/FUTURE_REQUIREMENTS.md) for roadmap.

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for details.
