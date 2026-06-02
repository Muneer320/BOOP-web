import os
import uuid
import re
from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from fastapi.responses import StreamingResponse
from limiter import limiter

router = APIRouter()
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), '..', 'uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)

IMAGE_SIGNATURES = {
    b'\x89PNG\r\n\x1a\n': 'png',
    b'\xff\xd8\xff': 'jpeg',
    b'GIF87a': 'gif',
    b'GIF89a': 'gif',
    b'RIFF': 'webp',
}

def detect_image_type(data):
    for sig, fmt in IMAGE_SIGNATURES.items():
        if data.startswith(sig):
            return fmt
    return None

@router.post("/upload")
@limiter.limit("10/minute")
async def upload_file(request: Request, file: UploadFile = File(...)):
    filename = file.filename
    if not (1 <= len(filename) <= 100):
        raise HTTPException(status_code=400, detail="Filename must be between 1 and 100 characters")
    if not re.match(r'^[\w\-. ]+$', filename):
        raise HTTPException(status_code=400, detail="Filename contains invalid characters")
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    if file.content_type.startswith("image/"):
        img_type = detect_image_type(content)
        if not img_type:
            raise HTTPException(status_code=400, detail="Invalid or unrecognized image format")
    elif file.content_type == "text/plain":
        pass
    else:
        raise HTTPException(status_code=400, detail="Only image or text uploads allowed")
    file_id = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
    file_path = os.path.join(UPLOAD_DIR, file_id)
    with open(file_path, "wb") as f:
        f.write(content)
    return {"file_id": file_id}

@router.get("/files/{file_id}")
def get_file(file_id: str):
    path = os.path.join(UPLOAD_DIR, file_id)
    if not os.path.exists(path):
        raise HTTPException(404, "File not found")
    return StreamingResponse(open(path, "rb"), media_type="application/octet-stream")

@router.get("/files")
def list_files():
    if not os.path.isdir(UPLOAD_DIR):
        return {"files": []}
    entries = os.listdir(UPLOAD_DIR)
    return {"files": entries}

@router.delete("/files/{file_id}")
def delete_file(file_id: str):
    path = os.path.join(UPLOAD_DIR, file_id)
    if not os.path.exists(path):
        raise HTTPException(404, "File not found")
    os.remove(path)
    return {"deleted": file_id}

@router.delete("/files")
def delete_all_files():
    if not os.path.isdir(UPLOAD_DIR):
        return {"deleted": []}
    entries = os.listdir(UPLOAD_DIR)
    deleted = []
    for file_id in entries:
        path = os.path.join(UPLOAD_DIR, file_id)
        if os.path.exists(path):
            os.remove(path)
            deleted.append(file_id)
    return {"deleted": deleted}
