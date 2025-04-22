import os
import uuid
import re
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse

router = APIRouter()
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), '..', 'uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    filename = file.filename
    if not (1 <= len(filename) <= 100):
        raise HTTPException(status_code=400, detail="Filename must be between 1 and 100 characters")
    if not re.match(r'^[\w\-. ]+$', filename):
        raise HTTPException(status_code=400, detail="Filename contains invalid characters")
    # Validate file type: allow images and plain text
    if not (file.content_type.startswith("image/") or file.content_type == "text/plain"):
        raise HTTPException(status_code=400, detail="Only image or text uploads allowed")
    file_id = str(uuid.uuid4()) + os.path.splitext(file.filename)[1]
    file_path = os.path.join(UPLOAD_DIR, file_id)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    return {"file_id": file_id}

@router.get("/files/{file_id}")
def get_file(file_id: str):
    path = os.path.join(UPLOAD_DIR, file_id)
    if not os.path.exists(path):
        raise HTTPException(404, "File not found")
    return StreamingResponse(open(path, "rb"), media_type="application/octet-stream")

@router.delete("/files/{file_id}")
def delete_file(file_id: str):
    path = os.path.join(UPLOAD_DIR, file_id)
    if not os.path.exists(path):
        raise HTTPException(404, "File not found")
    os.remove(path)
    return {"deleted": file_id}
