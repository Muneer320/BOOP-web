"""Regenerate the Wordo sample book shown on the Examples page.

Run from the repository root with the backend requirements installed:

    python scripts/make_wordo_sample.py

It builds the book in-process (no running server needed) from the SPORTS and
ASTRONOMY word lists, using the default cover and backgrounds, and writes
frontend/public/examples/Wordo.pdf.
"""

import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND = os.path.join(ROOT, "Backend")
OUTPUT = os.path.join(ROOT, "frontend", "public", "examples", "Wordo.pdf")
TOPICS = ("SPORTS", "ASTRONOMY")


def read_topics(path):
    topics, current = {}, None
    with open(path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith(">"):
                current = line[1:].strip()
                topics[current] = []
            elif current and line and not line.startswith("="):
                topics[current].append(line.upper())
    return topics


def main():
    sys.path.insert(0, BACKEND)
    from fastapi.testclient import TestClient
    from app import app

    app.state.limiter.enabled = False
    words = read_topics(os.path.join(BACKEND, "boop", "Words", "words.txt"))
    response = TestClient(app).post("/api/generate-puzzle", json={
        "name": "Wordo",
        "words_payload": {topic: words[topic] for topic in TOPICS},
        "normal": 3, "hard": 2, "bonus_normal": 1, "bonus_hard": 0,
    })
    response.raise_for_status()
    with open(OUTPUT, "wb") as f:
        f.write(response.content)
    print(f"Wrote {OUTPUT} ({len(response.content) // 1024} KB)")


if __name__ == "__main__":
    main()
