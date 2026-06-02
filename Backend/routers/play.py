from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import sys, os

boop_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'boop'))
sys.path.insert(0, boop_dir)
from boop.generatePuzzle import generate_wordsearch

router = APIRouter()

MODE_PRESETS = {
    "easy":      {"grid_size": 10, "allow_backwards": False, "mask": None, "min_words": 5,  "max_words": 12},
    "normal":    {"grid_size": 13, "allow_backwards": True,  "mask": None, "min_words": 8,  "max_words": 20},
    "hard":      {"grid_size": 15, "allow_backwards": True,  "mask": None, "min_words": 10, "max_words": 25},
    "veryhard":  {"grid_size": 18, "allow_backwards": True,  "mask": None, "min_words": 12, "max_words": 30},
    "nightmare": {"grid_size": 20, "allow_backwards": True,  "mask": None, "min_words": 15, "max_words": 35},
    "bonus":     {"grid_size": 15, "allow_backwards": True,  "mask": "circle", "min_words": 8, "max_words": 20},
}

class PlayGenerateRequest(BaseModel):
    words: List[str]
    mode: Optional[str] = None
    grid_size: Optional[int] = None
    allow_backwards: Optional[bool] = None
    mask: Optional[str] = None

@router.post("/play/generate")
async def play_generate(req: PlayGenerateRequest):
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

    grid, positions = generate_wordsearch(
        grid_size, grid_size, wordlist,
        allow_backwards_words=allow_backwards,
        mask=mask
    )

    if not grid:
        raise HTTPException(500, "Could not fit words into grid")

    return {
        "grid": [list(row) for row in grid],
        "positions": {w: {"start": [sx, sy], "end": [ex, ey]} for w, (sx, sy, ex, ey) in positions.items()},
        "words": wordlist,
        "grid_size": grid_size,
        "mode": req.mode or "custom",
        "mask": mask,
    }
