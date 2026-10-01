import asyncio
import functools
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask
from pydantic import BaseModel
from typing import Optional, Dict, List
from routers.files import UPLOAD_DIR
from limiter import limiter
from file_ids import is_safe_file_id
import os, shutil, tempfile, re, time, threading

boop_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'boop'))
import sys
sys.path.insert(0, boop_dir)
from boop.rawWordToJSON import word_to_json
from boop.generatePuzzle import create_all_puzzles
from boop.appendImage import append_page, append_puzzle_page
from boop.index import create_title_page

router = APIRouter()

# Progress is kept in this process. The server must therefore run a single
# uvicorn worker (see the Dockerfile): generation itself runs in a thread pool,
# so one worker still serves several books at once.
progress_store = {}
_progress_lock = threading.Lock()
PROGRESS_TTL_SECONDS = 15 * 60
SESSION_ID_RE = re.compile(r'^[A-Za-z0-9_-]{1,64}$')


class PuzzleFitError(Exception):
    """Some puzzles' words could not be placed in the grid."""


def _set_progress(session_id, step, detail="", done=False):
    if not session_id:
        return
    now = time.time()
    with _progress_lock:
        progress_store[session_id] = {"step": step, "detail": detail, "done": done, "updated": now}
        # Drop finished or abandoned sessions so the dict cannot grow without bound.
        for key in [k for k, v in progress_store.items() if now - v["updated"] > PROGRESS_TTL_SECONDS]:
            progress_store.pop(key, None)

SAFE_NAME_RE = re.compile(r'^[A-Za-z0-9\s\-_]+$')
def sanitize_filename(name):
    safe = re.sub(r'[^\w\s\-]', '', name).strip()
    return safe or "PuzzleBook"

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
@limiter.limit("3/minute")
async def generate_puzzle(req: GenerateRequest, request: Request, session_id: str = None):
    if not req.name or not SAFE_NAME_RE.match(req.name):
        raise HTTPException(400, "Invalid book name (letters, numbers, spaces, hyphens only)")
    for field in [req.words_file_id, req.cover_id, req.background_id, req.puzzle_bg_id]:
        if field and not is_safe_file_id(field):
            raise HTTPException(400, "Invalid file reference")
    for count, label in [(req.normal, "Normal"), (req.hard, "Hard"), (req.bonus_normal, "Bonus Normal"), (req.bonus_hard, "Bonus Hard")]:
        if not isinstance(count, int) or count < 0 or count > 100:
            raise HTTPException(400, f"{label} puzzle count must be 0-100")
    if session_id is not None and not SESSION_ID_RE.match(session_id):
        raise HTTPException(400, "Invalid session id")
    safe_name = sanitize_filename(req.name)

    outputs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', "outputs"))
    os.makedirs(outputs_dir, exist_ok=True)
    work_dir = tempfile.mkdtemp(prefix='boop_', dir=outputs_dir)

    def prog(step, detail=""):
        _set_progress(session_id, step, detail)

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

        def resolve(img_id, default_path):
            if img_id:
                path = os.path.join(UPLOAD_DIR, os.path.basename(img_id))
                if os.path.exists(path): return path
            return default_path

        cover_img = resolve(req.cover_id, os.path.join(boop_dir, 'Assets', 'Cover.png'))
        bg_img = resolve(req.background_id, os.path.join(boop_dir, 'Assets', 'Background.png'))
        pz_bg = resolve(req.puzzle_bg_id, os.path.join(boop_dir, 'Assets', 'pageBackground.png'))

        loop = asyncio.get_running_loop()
        prog("parsing", "Parsing word lists…")
        pdf_path = await loop.run_in_executor(None, functools.partial(
            _generate_sync, safe_name, words_txt, req, work_dir,
            cover_img, bg_img, pz_bg, prog
        ))

        if not os.path.exists(pdf_path):
            raise HTTPException(500, 'PDF generation failed')

        _set_progress(session_id, "complete", "PDF ready", done=True)

        return FileResponse(
            path=pdf_path,
            media_type='application/octet-stream',
            filename=f"{safe_name}.pdf",
            background=BackgroundTask(shutil.rmtree, work_dir, ignore_errors=True),
        )
    except PuzzleFitError as e:
        shutil.rmtree(work_dir, ignore_errors=True)
        _set_progress(session_id, "error", str(e), done=True)
        raise HTTPException(422, str(e)) from e
    except ValueError as e:
        # Raised by the word parser, e.g. a topic without enough words
        shutil.rmtree(work_dir, ignore_errors=True)
        _set_progress(session_id, "error", str(e), done=True)
        raise HTTPException(422, str(e)) from e
    except HTTPException:
        shutil.rmtree(work_dir, ignore_errors=True)
        _set_progress(session_id, "error", "Generation failed", done=True)
        raise
    except Exception as e:
        import traceback
        print(f"[generate-puzzle] ERROR: {e}")
        traceback.print_exc()
        shutil.rmtree(work_dir, ignore_errors=True)
        _set_progress(session_id, "error", "Generation failed", done=True)
        raise HTTPException(500, "An internal error occurred during puzzle generation") from e

@router.get("/generation-progress/{session_id}")
def get_progress(session_id: str):
    with _progress_lock:
        p = progress_store.get(session_id)
    if not p:
        return {"step": "unknown", "detail": "", "done": False}
    return {"step": p["step"], "detail": p["detail"], "done": p["done"]}

def _generate_sync(safe_name, words_txt, req, work_dir, cover_img, bg_img, pz_bg, prog):
    """Build the whole book inside work_dir and return the PDF path.

    Every path is absolute. The old version called os.chdir(), which changes the
    working directory for the whole process and broke books generated at the
    same time by other requests.
    """
    words_json = os.path.join(work_dir, 'words.json')
    book = os.path.join(work_dir, safe_name)
    pdf_path = f"{book}.pdf"
    prog("parsing", "Generating word JSON…")
    word_to_json(file_path=words_txt, output_path=words_json,
                 num_normal=req.normal, num_hard=req.hard,
                 bonus_normal=req.bonus_normal, bonus_hard=req.bonus_hard)
    prog("cover", "Adding cover page…")
    append_page(book, cover_img)
    prog("toc", "Creating table of contents…")
    create_title_page(pdf_path, words_json, background_image=bg_img)
    prog("puzzles", "Generating puzzles…")
    fails = create_all_puzzles(words_json, pz_bg, work_dir, progress_callback=lambda i, t: prog("puzzles", f"Puzzle {i}/{t}"))
    if fails:
        raise PuzzleFitError(
            f"Could not fit the words into the grid for puzzle(s) {', '.join(fails)}. "
            "Try shorter words or fewer words per topic."
        )
    prog("render_puzzles", "Rendering puzzle pages…")
    append_puzzle_page(pdf_path, work_dir, background_image=pz_bg, prog_callback=prog)
    prog("finalizing", "Finalizing PDF…")
    return pdf_path
