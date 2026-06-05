"""Upload puzzle backgrounds after rate-limit cooldown."""
import urllib.request
import json
import uuid
import os
import time

API = 'http://localhost:8000/api'
OUT = r'C:\Users\munee\MuneerBackup\Muneer\MainFolder\CodingPractices\BOOP web\frontend\public\examples'

def upload_file(fpath, fname):
    boundary = uuid.uuid4().hex
    with open(fpath, 'rb') as f:
        data = f.read()
    body = (
        f'--{boundary}\r\n'
        f'Content-Disposition: form-data; name="file"; filename="{fname}"\r\n'
        f'Content-Type: image/jpeg\r\n\r\n'
    ).encode() + data + f'\r\n--{boundary}--\r\n'.encode()
    req = urllib.request.Request(f'{API}/upload', data=body)
    req.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read()).get('file_id', '')

for f in ['puzzle_bg_clean1.jpg', 'puzzle_bg_clean2.jpg', 'puzzle_bg_clean3.jpg']:
    path = os.path.join(OUT, f)
    if os.path.exists(path):
        fid = upload_file(path, f)
        print(f'{f}: {fid}')
        time.sleep(7)
