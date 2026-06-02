from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Tuple
import sys, os, random

boop_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'boop'))
sys.path.insert(0, boop_dir)
from boop.generatePuzzle import generate_wordsearch

router = APIRouter()

class PlayGenerateRequest(BaseModel):
    words: List[str]
    grid_size: int = 15
    allow_backwards: bool = True
    mask: str = None

@router.post("/play/generate")
async def play_generate(req: PlayGenerateRequest):
    if len(req.words) < 3:
        raise HTTPException(400, "Need at least 3 words")
    if len(req.words) > 30:
        raise HTTPException(400, "Max 30 words")
    if req.grid_size < 8 or req.grid_size > 32:
        raise HTTPException(400, "Grid size must be 8-32")

    wordlist = [w.strip().upper() for w in req.words if w.strip()]
    grid, positions = generate_wordsearch(
        req.grid_size, req.grid_size, wordlist,
        allow_backwards_words=req.allow_backwards,
        mask=req.mask
    )

    if not grid:
        raise HTTPException(500, "Could not fit words into grid")

    positions_serializable = {
        word: {"start": [int(sx), int(sy)], "end": [int(ex), int(ey)]}
        for word, (sx, sy, ex, ey) in positions.items()
    }

    return {
        "grid": [list(row) for row in grid],
        "positions": positions_serializable,
        "words": wordlist,
        "grid_size": req.grid_size
    }
