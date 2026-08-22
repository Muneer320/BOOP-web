import asyncio
import json
import os
import sys
import threading

import httpx
import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app import app  # noqa: E402
from boop import generatePuzzle  # noqa: E402
from routers import generate  # noqa: E402

app.state.limiter.enabled = False

WORDS = {
    "Fruits": ["APPLE", "MANGO", "GRAPE", "LEMON", "PEACH", "MELON", "GUAVA", "PAPAYA", "CHERRY",
               "BANANA", "ORANGE", "APRICOT", "COCONUT", "KIWIFRUIT", "PINEAPPLE", "BLUEBERRY",
               "STRAWBERRY", "RASPBERRY", "BLACKBERRY", "POMEGRANATE", "WATERMELON", "TANGERINE"],
}


def _request(name, **counts):
    body = {"name": name, "words_payload": WORDS, "normal": 1, "hard": 1, "bonus_normal": 1, "bonus_hard": 0}
    body.update(counts)
    return body


async def _post_two_at_once():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test", timeout=300) as client:
        return await asyncio.gather(
            client.post("/api/generate-puzzle", json=_request("Book A")),
            client.post("/api/generate-puzzle", json=_request("Book B")),
        )


def test_two_books_can_be_generated_at_the_same_time():
    cwd = os.getcwd()
    first, second = asyncio.run(_post_two_at_once())
    assert first.status_code == 200, first.text
    assert second.status_code == 200, second.text
    assert first.content[:5] == b"%PDF-" and second.content[:5] == b"%PDF-"
    assert os.getcwd() == cwd  # the server never changes the process working directory


def test_bonus_normal_puzzles_use_the_normal_grid(tmp_path, monkeypatch):
    sizes = {}

    def fake(puzzle_filename, wordlist, nrows, ncols, mask_type=None, background_image=None, page_number=None):
        sizes[page_number] = (nrows, mask_type)
        return None

    monkeypatch.setattr(generatePuzzle, "create_puzzle_and_solution", fake)
    monkeypatch.setattr(generatePuzzle, "create_transition_svg", lambda *a, **k: None)
    words_json = tmp_path / "words.json"
    words_json.write_text(json.dumps({"T": {"Normal": [["A"]], "Hard": [["B"]],
                                            "Bonus": {"Normal": [["C"]], "Hard": [["D"]]}}}))
    assert generatePuzzle.create_all_puzzles(str(words_json), None, str(tmp_path)) == []
    assert sizes == {"1N1": (13, None), "1H1": (17, None), "1BN1": (13, "circle"), "1BH1": (17, "circle")}


def test_puzzles_are_retried_and_reported_when_they_never_fit(tmp_path, monkeypatch):
    attempts = {}

    def flaky(puzzle_filename, wordlist, nrows, ncols, mask_type=None, background_image=None, page_number=None):
        attempts[page_number] = attempts.get(page_number, 0) + 1
        if page_number == "1H1":
            return puzzle_filename  # never fits
        return None if attempts[page_number] >= 2 else puzzle_filename  # fits on the second try

    monkeypatch.setattr(generatePuzzle, "create_puzzle_and_solution", flaky)
    monkeypatch.setattr(generatePuzzle, "create_transition_svg", lambda *a, **k: None)
    words_json = tmp_path / "words.json"
    words_json.write_text(json.dumps({"T": {"Normal": [["A"]], "Hard": [["B"]], "Bonus": {"Normal": [], "Hard": []}}}))
    assert generatePuzzle.create_all_puzzles(str(words_json), None, str(tmp_path)) == ["1H1"]
    grid_steps = generatePuzzle.MAX_GRID_GROWTH // generatePuzzle.GRID_GROWTH + 1
    assert attempts == {"1N1": 2, "1H1": generatePuzzle.PUZZLE_RETRIES * grid_steps}


def test_grid_grows_when_the_words_do_not_fit_at_the_intended_size(tmp_path, monkeypatch):
    tried = []

    def needs_room(puzzle_filename, wordlist, nrows, ncols, mask_type=None, background_image=None, page_number=None):
        tried.append(nrows)
        return None if nrows >= 15 else puzzle_filename

    monkeypatch.setattr(generatePuzzle, "create_puzzle_and_solution", needs_room)
    monkeypatch.setattr(generatePuzzle, "create_transition_svg", lambda *a, **k: None)
    words_json = tmp_path / "words.json"
    words_json.write_text(json.dumps({"T": {"Normal": [], "Hard": [], "Bonus": {"Normal": [["A"]], "Hard": []}}}))
    assert generatePuzzle.create_all_puzzles(str(words_json), None, str(tmp_path)) == []
    assert tried == [13] * generatePuzzle.PUZZLE_RETRIES + [15]


def test_unplaceable_words_return_422_instead_of_a_book_with_a_missing_page(monkeypatch):
    monkeypatch.setattr(generate, "create_all_puzzles", lambda *a, **k: ["1N1"])
    transport = httpx.ASGITransport(app=app)

    async def post():
        async with httpx.AsyncClient(transport=transport, base_url="http://test", timeout=120) as client:
            return await client.post("/api/generate-puzzle?session_id=s-1", json=_request("Book C"))

    response = asyncio.run(post())
    assert response.status_code == 422
    assert "1N1" in response.json()["detail"]


def test_too_few_words_is_a_422(monkeypatch):
    transport = httpx.ASGITransport(app=app)
    body = {"name": "Tiny", "words_payload": {"T": ["APPLE", "MANGO"]}, "normal": 5, "hard": 0,
            "bonus_normal": 0, "bonus_hard": 0}

    async def post():
        async with httpx.AsyncClient(transport=transport, base_url="http://test", timeout=60) as client:
            return await client.post("/api/generate-puzzle", json=body)

    response = asyncio.run(post())
    assert response.status_code == 422 and "normal-length words" in response.json()["detail"]


def test_progress_is_reported_and_session_ids_are_validated():
    from fastapi.testclient import TestClient

    client = TestClient(app)
    generate._set_progress("abc", "puzzles", "Puzzle 1/3")
    assert client.get("/api/generation-progress/abc").json() == {"step": "puzzles", "detail": "Puzzle 1/3", "done": False}
    assert client.get("/api/generation-progress/nope").json()["step"] == "unknown"
    bad = client.post("/api/generate-puzzle?session_id=../../x", json=_request("Book D"))
    assert bad.status_code == 400


def test_old_progress_entries_expire(monkeypatch):
    generate._set_progress("old", "puzzles")
    generate.progress_store["old"]["updated"] -= generate.PROGRESS_TTL_SECONDS + 1
    generate._set_progress("new", "puzzles")
    assert "old" not in generate.progress_store and "new" in generate.progress_store


def test_settings_match_the_generator():
    from fastapi.testclient import TestClient

    settings = TestClient(app).get("/api/settings").json()
    assert settings["grid_sizes"] == {"Normal": 13, "Hard": 17, "Bonus Normal": 13, "Bonus Hard": 17}
    assert "squares" not in json.dumps(settings)
