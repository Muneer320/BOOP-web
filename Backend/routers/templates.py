import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

router = APIRouter()
TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), '..', 'boop', 'Assets')

@router.get('/templates')
def list_templates():
    if not os.path.isdir(TEMPLATES_DIR):
        return {'templates': []}
    entries = os.listdir(TEMPLATES_DIR)
    return {'templates': entries}

@router.get('/templates/{template_id}')
def get_template(template_id: str):
    path = os.path.join(TEMPLATES_DIR, template_id)
    if not os.path.isfile(path):
        raise HTTPException(status_code=404, detail='Template not found')
    return FileResponse(path, media_type='application/octet-stream')
