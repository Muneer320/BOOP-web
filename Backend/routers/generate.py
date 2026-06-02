import asyncio
import functools
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask
from pydantic import BaseModel
from typing import Optional, Dict, List
from routers.files import UPLOAD_DIR
import os, shutil, tempfile, re

boop_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'boop'))
import sys
sys.path.insert(0, boop_dir)
from boop.rawWordToJSON import word_to_json
from boop.generatePuzzle import create_all_puzzles, create_individual_puzzle
from boop.appendImage import append_page, append_puzzle_page
from boop.index import create_title_page

router = APIRouter()

progress_store = {}

SAFE_NAME_RE = re.compile(r'^[A-Za-z0-9\s\-_]+$')
FILE_ID_RE = re.compile(r'^[a-f0-9\-]+\.[a-zA-Z0-9]+$')

def sanitize_filename(name):
    safe = re.sub(r'[^\w\s\-]', '', name).strip()
    return safe or "PuzzleBook"

def is_safe_file_id(file_id):
    if not file_id:
        return True
    basename = os.path.basename(file_id)
    return bool(FILE_ID_RE.match(basename)) and basename == file_id

class GenerateRequest(BaseModel):
    name: str
    words_payload: Optional[Dict[str, List[str]]] = None
    words_file_id: Optional[str] = None
    normal: int = 10
    hard: int = 5
    bonus_normal: int = 1
    bonus_hard: int = 1
    cover_id: Optional[str] = None
    background_id: Optional[str] = None
    puzzle_bg_id: Optional[str] = None

@router.post("/generate-puzzle")
async def generate_puzzle(req: GenerateRequest, session_id: str = None):
    if not req.name or not SAFE_NAME_RE.match(req.name):
        raise HTTPException(400, "Invalid book name (letters, numbers, spaces, hyphens only)")
    for field in [req.words_file_id, req.cover_id, req.background_id, req.puzzle_bg_id]:
        if field and not is_safe_file_id(field):
            raise HTTPException(400, "Invalid file reference")
    safe_name = sanitize_filename(req.name)

    outputs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', "outputs"))
    os.makedirs(outputs_dir, exist_ok=True)
    work_dir = tempfile.mkdtemp(prefix='boop_', dir=outputs_dir)

    def prog(step, detail=""):
        if session_id:
            progress_store[session_id] = {"step": step, "detail": detail, "done": False}

    try:
        if req.words_payload:
            temp_input = os.path.join(work_dir, 'input_words.txt')
            with open(temp_input, 'w', encoding='utf-8') as f:
                for topic, words in req.words_payload.items():
                    f.write(f"> {topic}\n\n")
                    for w in words:
                        f.write(w + "\n")
                    f.write("\n\n====================\n")
            words_txt = temp_input
        elif req.words_file_id:
            words_txt = os.path.join(UPLOAD_DIR, os.path.basename(req.words_file_id))
        else:
            words_txt = os.path.join(boop_dir, 'Words', 'words.txt')

        old_cwd = os.getcwd()
        os.chdir(work_dir)

        def resolve(img_id, default_path):
            if img_id:
                path = os.path.join(UPLOAD_DIR, os.path.basename(img_id))
                if os.path.exists(path): return path
            return default_path

        cover_img = resolve(req.cover_id, os.path.join(boop_dir, 'Assets', 'Cover.png'))
        bg_img = resolve(req.background_id, os.path.join(boop_dir, 'Assets', 'Background.png'))
        pz_bg = resolve(req.puzzle_bg_id, os.path.join(boop_dir, 'Assets', 'pageBackground.png'))

        loop = asyncio.get_event_loop()
        prog("parsing", "Parsing word lists…")
        await loop.run_in_executor(None, functools.partial(
            _generate_sync, safe_name, words_txt, req, work_dir, boop_dir,
            cover_img, bg_img, pz_bg, prog, old_cwd
        ))

        pdf_path = os.path.join(work_dir, f"{safe_name}.pdf")
        if not os.path.exists(pdf_path):
            raise HTTPException(500, 'PDF generation failed')

        if session_id:
            progress_store[session_id] = {"step": "complete", "detail": "PDF ready", "done": True}

        return FileResponse(
            path=pdf_path,
            media_type='application/octet-stream',
            filename=f"{safe_name}.pdf",
            background=BackgroundTask(_cleanup, work_dir, old_cwd),
        )
    except HTTPException:
        shutil.rmtree(work_dir, ignore_errors=True)
        os.chdir(old_cwd)
        if session_id:
            progress_store[session_id] = {"step": "error", "detail": "Generation failed", "done": True}
        raise
    except Exception as e:
        shutil.rmtree(work_dir, ignore_errors=True)
        os.chdir(old_cwd)
        if session_id:
            progress_store[session_id] = {"step": "error", "detail": str(e), "done": True}
        raise HTTPException(500, str(e))

@router.get("/generation-progress/{session_id}")
def get_progress(session_id: str):
    p = progress_store.get(session_id)
    if not p:
        return {"step": "unknown", "detail": "", "done": False}
    return p

def _generate_sync(safe_name, words_txt, req, work_dir, boop_dir, cover_img, bg_img, pz_bg, prog, old_cwd):
    words_json = os.path.join(work_dir, 'words.json')
    prog("parsing", "Generating word JSON…")
    word_to_json(file_path=words_txt, output_path=words_json,
                 num_normal=req.normal, num_hard=req.hard,
                 bonus_normal=req.bonus_normal, bonus_hard=req.bonus_hard)
    prog("cover", "Adding cover page…")
    append_page(safe_name, cover_img)
    prog("toc", "Creating table of contents…")
    create_title_page(safe_name, words_json, background_image=bg_img)
    prog("puzzles", "Generating puzzles…")
    fails = create_all_puzzles(words_json, pz_bg, work_dir, progress_callback=lambda i, t: prog("puzzles", f"Puzzle {i}/{t}"))
    if fails:
        prog("puzzles", f"Retrying {len(fails)} failed puzzles…")
        create_individual_puzzle(fails, words_json, work_dir, background_image=pz_bg)
    prog("assembling", "Assembling PDF pages…")
    append_puzzle_page(f"{safe_name}.pdf", work_dir, background_image=pz_bg)
    prog("finalizing", "Finalizing PDF…")

def _cleanup(work_dir, old_cwd):
    os.chdir(old_cwd)
    shutil.rmtree(work_dir, ignore_errors=True)