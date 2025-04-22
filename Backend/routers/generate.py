from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from starlette.background import BackgroundTask
from pydantic import BaseModel
from typing import Optional, Dict, List
from routers.files import UPLOAD_DIR
import os, shutil, tempfile, io

# Import BOOP logic
import importlib.util
base = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'boop'))
import sys
sys.path.insert(0, base)
from boop.rawWordToJSON import word_to_json
from boop.generatePuzzle import create_all_puzzles, create_individual_puzzle
from boop.appendImage import append_page, append_puzzle_page
from boop.index import create_title_page

router = APIRouter()

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
async def generate_puzzle(req: GenerateRequest):
    # Prepare paths
    boop_dir = base
    # Handle custom words input
    if req.words_payload:
        # write JSON payload to temp txt in BOOP/Words format
        output_folder = tempfile.mkdtemp(prefix='boop_', dir=os.path.abspath(os.path.join(os.path.dirname(__file__), '..', "outputs")))
        temp_input = os.path.join(output_folder, 'input_words.txt')
        with open(temp_input, 'w', encoding='utf-8') as f:
            for topic, words in req.words_payload.items():
                f.write(f"> {topic}\n\n")
                for w in words:
                    f.write(w + "\n")
                f.write("\n\n====================\n")
        words_txt = temp_input
    elif req.words_file_id:
        output_folder = tempfile.mkdtemp(prefix='boop_', dir=os.path.abspath(os.path.join(os.path.dirname(__file__), '..', "outputs")))
        words_txt = os.path.join(UPLOAD_DIR, req.words_file_id)
    else:
        output_folder = tempfile.mkdtemp(prefix='boop_', dir=os.path.abspath(os.path.join(os.path.dirname(__file__), '..', "outputs")))
        words_txt = os.path.join(boop_dir, 'Words', 'words.txt')
    pdf_path = os.path.join(os.getcwd(), f"{req.name}.pdf")

    # Resolve images (uploaded vs defaults)
    def resolve(img_id, default_path):
        if img_id:
            path = os.path.join(UPLOAD_DIR, img_id)
            if os.path.exists(path): return path
            print(f"Image {img_id} not found")
        return default_path

    cover_img = resolve(req.cover_id, os.path.join(boop_dir, 'Assets', 'Cover.png'))
    bg_img = resolve(req.background_id, os.path.join(boop_dir, 'Assets', 'Background.png'))
    pz_bg = resolve(req.puzzle_bg_id, os.path.join(boop_dir, 'Assets', 'pageBackground.png'))

    # Step 1: generate JSON
    try:
        # Generate words.json from specified source
        word_to_json(file_path=words_txt,
                     num_normal=req.normal,
                     num_hard=req.hard,
                     bonus_normal=req.bonus_normal,
                     bonus_hard=req.bonus_hard)
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

    words_json = os.path.join(boop_dir, 'Words', 'words.json')

    # Remove existing PDF
    if os.path.exists(pdf_path): os.remove(pdf_path)

    # Step 2: cover + title
    append_page(req.name, cover_img)
    create_title_page(req.name, words_json, background_image=bg_img)

    # Step 3: puzzles
    fails = create_all_puzzles(words_json, pz_bg, output_folder)
    if fails:
        create_individual_puzzle(fails, words_json, output_folder, background_image=pz_bg)

    # Step 4: append to PDF
    append_puzzle_page(f"{req.name}.pdf", output_folder, background_image=pz_bg)

    # Stream PDF back
    if not os.path.exists(pdf_path):
        raise HTTPException(500, 'PDF generation failed')

    try:
        response = FileResponse(
            path=pdf_path,
            media_type='application/octet-stream',
            filename=f"{req.name}.pdf",
            background=BackgroundTask(os.remove, pdf_path),
        )
    finally:
        shutil.rmtree(output_folder, ignore_errors=True)

    return response