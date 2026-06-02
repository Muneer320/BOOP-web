from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import List, Optional
from limiter import limiter
import sys, os, random

boop_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'boop'))
sys.path.insert(0, boop_dir)
from boop.generatePuzzle import generate_wordsearch

router = APIRouter()

MODE_PRESETS = {
    "easy":      {"grid_size": 10, "allow_backwards": False, "mask": None, "min_words": 4,  "max_words": 7},
    "normal":    {"grid_size": 13, "allow_backwards": True,  "mask": None, "min_words": 6,  "max_words": 10},
    "hard":      {"grid_size": 15, "allow_backwards": True,  "mask": None, "min_words": 8,  "max_words": 13},
    "veryhard":  {"grid_size": 18, "allow_backwards": True,  "mask": None, "min_words": 10, "max_words": 16},
    "nightmare": {"grid_size": 20, "allow_backwards": True,  "mask": None, "min_words": 12, "max_words": 20},
    "bonus":     {"grid_size": 15, "allow_backwards": True,  "mask": "circle", "min_words": 6,  "max_words": 11},
}

class PlayGenerateRequest(BaseModel):
    words: List[str]
    mode: Optional[str] = None
    grid_size: Optional[int] = None
    allow_backwards: Optional[bool] = None
    mask: Optional[str] = None

@router.post("/play/generate")
@limiter.limit("10/minute")
async def play_generate(req: PlayGenerateRequest, request: Request):
    if req.mode and req.mode in MODE_PRESETS:
        preset = MODE_PRESETS[req.mode]
        grid_size = preset["grid_size"]
        allow_backwards = preset["allow_backwards"]
        mask = preset["mask"]
        min_words = preset["min_words"]
        max_words = preset["max_words"]
    else:
        grid_size = req.grid_size or 13
        allow_backwards = req.allow_backwards if req.allow_backwards is not None else True
        mask = req.mask
        min_words = 3
        max_words = 30

    grid_size = max(8, min(grid_size, 32))
    wordlist = [w.strip().upper() for w in req.words if w.strip()]

    if len(wordlist) < min_words:
        raise HTTPException(400, f"Need at least {min_words} words for {req.mode or 'custom'} mode, got {len(wordlist)}")
    if len(wordlist) > max_words:
        raise HTTPException(400, f"Max {max_words} words for {req.mode or 'custom'} mode, got {len(wordlist)}")

    placed = None
    shuffled = wordlist[:]
    random.shuffle(shuffled)
    for n in range(len(shuffled), min_words - 1, -1):
        subset = shuffled[:n]
        grid, positions = generate_wordsearch(
            grid_size, grid_size, subset,
            allow_backwards_words=allow_backwards,
            mask=mask
        )
        if grid:
            placed = (grid, positions, subset)
            break

    if not placed:
        raise HTTPException(500, "Could not fit words into grid")

    grid, positions, wordlist = placed

    cells_by_word = {}
    for w, (sx, sy, ex, ey) in positions.items():
        dr = 0 if ex == sx else (1 if ex > sx else -1)
        dc = 0 if ey == sy else (1 if ey > sy else -1)
        cells = []
        x, y = sx, sy
        while True:
            cells.append([y, x])
            if x == ex and y == ey:
                break
            x += dr
            y += dc
        cells_by_word[w] = cells

    return {
        "grid": [list(row) for row in grid],
        "positions": {w: {"start": [sx, sy], "end": [ex, ey]} for w, (sx, sy, ex, ey) in positions.items()},
        "cells_by_word": cells_by_word,
        "words": wordlist,
        "grid_size": grid_size,
        "mode": req.mode or "custom",
        "mask": mask,
    }
