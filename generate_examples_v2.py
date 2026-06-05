"""Generate example PDFs with proper cover/background/puzzle background images."""
import urllib.request
import json
import os
import uuid
import time

API = 'http://localhost:8000/api'
OUT = r'C:\Users\munee\MuneerBackup\Muneer\MainFolder\CodingPractices\BOOP web\frontend\public\examples'
os.makedirs(OUT, exist_ok=True)

def download_image(url, path):
    """Download image from URL."""
    try:
        urllib.request.urlretrieve(url, path)
        print(f"  Downloaded: {os.path.basename(path)}")
        return True
    except Exception as e:
        print(f"  Failed: {e}")
        return False

def upload_file(fpath, fname, content_type='image/jpeg'):
    """Upload file to backend and return file_id."""
    boundary = uuid.uuid4().hex
    with open(fpath, 'rb') as f:
        data = f.read()
    body = (
        f'--{boundary}\r\n'
        f'Content-Disposition: form-data; name="file"; filename="{fname}"\r\n'
        f'Content-Type: {content_type}\r\n\r\n'
    ).encode() + data + f'\r\n--{boundary}--\r\n'.encode()
    req = urllib.request.Request(f'{API}/upload', data=body)
    req.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')
    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read())
        return result.get('file_id', '')
    except urllib.error.HTTPError as e:
        print(f"  Upload error: {e.code} {e.read().decode()}")
        return ''

def generate_pdf(name, payload, outpath):
    """Generate a PDF and save to outpath."""
    data = json.dumps(payload).encode()
    req = urllib.request.Request(f'{API}/generate-puzzle', data=data, method='POST')
    req.add_header('Content-Type', 'application/json')
    try:
        with urllib.request.urlopen(req) as resp:
            pdf_data = resp.read()
        with open(outpath, 'wb') as f:
            f.write(pdf_data)
        print(f'  Generated: {name} ({len(pdf_data)} bytes)')
        return True
    except urllib.error.HTTPError as e:
        print(f"  Generate error: {e.code} {e.read().decode()}")
        return False

# ============================================================
# 1. Download images for covers, backgrounds, puzzle backgrounds
# ============================================================
print("=" * 60)
print("STEP 1: Downloading images...")
print("=" * 60)

images = {
    # Covers (thematic, defining what the book is about)
    'sports_cover.jpg': 'https://picsum.photos/seed/cover-sports/600/800',
    'nature_cover.jpg': 'https://picsum.photos/seed/cover-nature/600/800',
    'space_cover.jpg': 'https://picsum.photos/seed/cover-space/600/800',
    'culture_cover.jpg': 'https://picsum.photos/seed/cover-culture/600/800',
    'science_cover.jpg': 'https://picsum.photos/seed/cover-science/600/800',
    'mixed_cover.jpg': 'https://picsum.photos/seed/cover-mixed/600/800',
    'kids_cover.jpg': 'https://picsum.photos/seed/cover-kids/600/800',
    # Background images (for transition pages - text will be written on these)
    'bg_paper1.jpg': 'https://picsum.photos/seed/bg-paper1/800/600',
    'bg_paper2.jpg': 'https://picsum.photos/seed/bg-paper2/800/600',
    'bg_paper3.jpg': 'https://picsum.photos/seed/bg-paper3/800/600',
    # Puzzle backgrounds (minimal/clean - text must be readable)
    'puzzle_bg_clean1.jpg': 'https://picsum.photos/seed/pbg-clean1/800/800',
    'puzzle_bg_clean2.jpg': 'https://picsum.photos/seed/pbg-clean2/800/800',
    'puzzle_bg_clean3.jpg': 'https://picsum.photos/seed/pbg-clean3/800/800',
}

local_images = {}
for name, url in images.items():
    path = os.path.join(OUT, name)
    if download_image(url, path):
        local_images[name] = path

# ============================================================
# 2. Upload images to backend
# ============================================================
print("\n" + "=" * 60)
print("STEP 2: Uploading images...")
print("=" * 60)

time.sleep(1)  # Rate limit

uploaded = {}
for name, path in local_images.items():
    fid = upload_file(path, name)
    if fid:
        uploaded[name] = fid
        print(f"  Uploaded: {name} -> {fid}")
    time.sleep(0.5)

# Organize by role
covers = {k: v for k, v in uploaded.items() if k.startswith(('sports_cover', 'nature_cover', 'space_cover', 'culture_cover', 'science_cover', 'mixed_cover', 'kids_cover'))}
backgrounds = {k: v for k, v in uploaded.items() if k.startswith('bg_')}
puzzle_bgs = {k: v for k, v in uploaded.items() if k.startswith('puzzle_bg_')}

cover_keys = list(covers.keys())
bg_keys = list(backgrounds.keys())
pbg_keys = list(puzzle_bgs.keys())

print(f"\n  Covers: {len(cover_keys)}")
print(f"  Backgrounds: {len(bg_keys)}")
print(f"  Puzzle BGs: {len(pbg_keys)}")

if not cover_keys or not bg_keys or not pbg_keys:
    print("ERROR: Missing required images!")
    exit(1)

# ============================================================
# 3. Generate PDFs with proper images
# ============================================================
print("\n" + "=" * 60)
print("STEP 3: Generating PDFs...")
print("=" * 60)

configs = [
    {
        'name': 'Sports_and_Games',
        'words': {'SPORTS': ['FOOTBALL','BASKETBALL','TENNIS','SWIMMING','SOCCER','BASEBALL','VOLLEYBALL','GOLF','HOCKEY','RUGBY','CRICKET','BADMINTON','BOXING','KARATE','JUDO','FENCING','SKIING','SURFING','CYCLING','ARCHERY']},
        'normal': 2, 'hard': 1, 'bonus_normal': 1, 'bonus_hard': 0,
        'cover': cover_keys[0], 'bg': bg_keys[0], 'pbg': pbg_keys[0],
    },
    {
        'name': 'Science_and_Wildlife',
        'words': {
            'SCIENCE': ['ATOM','MOLECULE','CELL','GENE','DNA','PROTON','NEUTRON','ELECTRON','ORBIT','ELEMENT','COMPOUND','MIXTURE','ENERGY','FORCE','GRAVITY'],
            'WILDLIFE': ['ELEPHANT','TIGER','LION','BEAR','WOLF','DEER','FOX','RABBIT','HAWK','EAGLE','SNAKE','GORILLA','ZEBRA','GIRAFFE','PANDA'],
        },
        'normal': 2, 'hard': 1, 'bonus_normal': 0, 'bonus_hard': 0,
        'cover': cover_keys[1], 'bg': bg_keys[0], 'pbg': pbg_keys[1],
    },
    {
        'name': 'Cultural_Journey',
        'words': {'CULTURE': ['MUSIC','DANCE','PAINTING','SCULPTURE','THEATRE','CINEMA','LITERATURE','POETRY','FOLKLORE','MYTHOLOGY','FESTIVAL','CUISINE','FASHION','ARCHITECTURE','LANGUAGE','TRADITION','HERITAGE','RITUAL','MELODY','RHYTHM']},
        'normal': 0, 'hard': 3, 'bonus_normal': 1, 'bonus_hard': 0,
        'cover': cover_keys[3], 'bg': bg_keys[1], 'pbg': pbg_keys[2],
    },
    {
        'name': 'Astronomy_Explorer',
        'words': {'ASTROMONY': ['STAR','PLANET','MOON','SUN','COMET','ASTEROID','GALAXY','NEBULA','ORBIT','ECLIPSE','TELESCOPE','SATELLITE','CONSTELLATION','METEOR','SUPERNOVA','BLACKHOLE','SOLAR','LUNAR','COSMIC','ASTRONAUT']},
        'normal': 2, 'hard': 0, 'bonus_normal': 2, 'bonus_hard': 0,
        'cover': cover_keys[2], 'bg': bg_keys[1], 'pbg': pbg_keys[0],
    },
    {
        'name': 'Mega_Puzzle_Book',
        'words': {
            'SPORTS': ['FOOTBALL','BASKETBALL','TENNIS','SWIMMING','SOCCER'],
            'SCIENCE': ['ATOM','MOLECULE','CELL','GENE','DNA'],
            'WILDLIFE': ['ELEPHANT','TIGER','LION','BEAR','WOLF'],
            'CULTURE': ['MUSIC','DANCE','PAINTING','THEATRE','CINEMA'],
            'ASTROMONY': ['STAR','PLANET','MOON','SUN','COMET'],
        },
        'normal': 2, 'hard': 1, 'bonus_normal': 1, 'bonus_hard': 1,
        'cover': cover_keys[5], 'bg': bg_keys[2], 'pbg': pbg_keys[1],
    },
    {
        'name': 'Sports_Deluxe',
        'words': {'SPORTS': ['FOOTBALL','BASKETBALL','TENNIS','SWIMMING','SOCCER','BASEBALL','VOLLEYBALL','GOLF','HOCKEY','RUGBY','CRICKET','BADMINTON','BOXING','KARATE','JUDO']},
        'normal': 2, 'hard': 1, 'bonus_normal': 1, 'bonus_hard': 0,
        'cover': cover_keys[0], 'bg': bg_keys[2], 'pbg': pbg_keys[2],
    },
    {
        'name': 'Nature_Explorer',
        'words': {'WILDLIFE': ['ELEPHANT','TIGER','LION','BEAR','WOLF','DEER','FOX','RABBIT','HAWK','EAGLE','SNAKE','GORILLA','ZEBRA','GIRAFFE','PANDA','KOALA']},
        'normal': 2, 'hard': 1, 'bonus_normal': 0, 'bonus_hard': 0,
        'cover': cover_keys[1], 'bg': bg_keys[0], 'pbg': pbg_keys[1],
    },
    {
        'name': 'Mixed_Collection',
        'words': {
            'SCIENCE': ['ATOM','CELL','GENE','DNA','PROTON','ENERGY','FORCE','ORBIT'],
            'CULTURE': ['MUSIC','DANCE','PAINTING','POETRY','THEATRE','FESTIVAL','HERITAGE'],
            'ASTROMONY': ['STAR','MOON','PLANET','COMET','GALAXY','NEBULA','ORBIT'],
        },
        'normal': 1, 'hard': 1, 'bonus_normal': 0, 'bonus_hard': 0,
        'cover': cover_keys[5], 'bg': bg_keys[2], 'pbg': pbg_keys[2],
    },
]

for cfg in configs:
    print(f"\n--- {cfg['name']} ---")
    payload = {
        'name': cfg['name'],
        'words_payload': cfg['words'],
        'normal': cfg['normal'],
        'hard': cfg['hard'],
        'bonus_normal': cfg['bonus_normal'],
        'bonus_hard': cfg['bonus_hard'],
        'cover_id': covers.get(cfg['cover'], ''),
        'background_id': backgrounds.get(cfg['bg'], ''),
        'puzzle_bg_id': puzzle_bgs.get(cfg['pbg'], ''),
    }
    outpath = os.path.join(OUT, f"{cfg['name']}.pdf")
    generate_pdf(cfg['name'], payload, outpath)
    time.sleep(25)  # Rate limit: 3/min

print("\n" + "=" * 60)
print("DONE! All PDFs generated.")
print("=" * 60)
