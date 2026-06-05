"""Re-generate PDFs using known uploaded image IDs."""
import urllib.request
import json
import os
import time

API = 'http://localhost:8000/api'
OUT = r'C:\Users\munee\MuneerBackup\Muneer\MainFolder\CodingPractices\BOOP web\frontend\public\examples'

# Known uploaded file IDs
COVERS = {
    'sports': 'd51da112-1619-4178-a6d2-b238e6238169.jpg',
    'nature': 'a3cd8494-b768-40e9-b4ea-3d651e906e8f.jpg',
    'space': '12468f93-d71b-4bef-beb7-a87efcee1436.jpg',
    'culture': '2b9cf008-db08-4c4d-8f18-eed8814ab01e.jpg',
    'science': '4509dd7c-a215-4089-9598-ab3188926bdd.jpg',
    'mixed': '022f9776-ba52-4bc2-b3a9-27da41a0a445.jpg',
    'kids': 'dbcbe39a-5217-41ba-bb0a-c33cd8e46c60.jpg',
}
BGS = {
    'bg1': '83c87f19-5e7c-4e22-ae1c-d24eba708a0d.jpg',
    'bg2': '49ed0a8c-b560-472c-899e-6cf668bb7592.jpg',
    'bg3': '425b4977-e37d-4e4b-ac69-f9f67d9f73e5.jpg',
}
PBGS = {
    'pbg1': '22c87e60-7bcb-4e2b-92e5-037715e17887.jpg',
    'pbg2': '1809e73a-89aa-4b88-808a-02c98a0408de.jpg',
    'pbg3': 'eab014c6-f21c-4968-a751-d87d628a7583.jpg',
}

def generate_pdf(name, payload, outpath):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(f'{API}/generate-puzzle', data=data, method='POST')
    req.add_header('Content-Type', 'application/json')
    try:
        with urllib.request.urlopen(req) as resp:
            pdf_data = resp.read()
        with open(outpath, 'wb') as f:
            f.write(pdf_data)
        print(f'  OK: {name} ({len(pdf_data)} bytes)')
        return True
    except urllib.error.HTTPError as e:
        print(f"  FAIL: {e.code} {e.read().decode()}")
        return False

configs = [
    {
        'name': 'Sports_and_Games',
        'words': {'SPORTS': ['FOOTBALL','BASKETBALL','TENNIS','SWIMMING','SOCCER','BASEBALL','VOLLEYBALL','GOLF','HOCKEY','RUGBY','CRICKET','BADMINTON','BOXING','KARATE','JUDO','FENCING','SKIING','SURFING','ARCHERY']},
        'normal': 2, 'hard': 1, 'bonus_normal': 1, 'bonus_hard': 0,
        'cover': COVERS['sports'], 'bg': BGS['bg1'], 'pbg': PBGS['pbg1'],
    },
    {
        'name': 'Science_and_Wildlife',
        'words': {
            'SCIENCE': ['ATOM','MOLECULE','CELL','GENE','DNA','PROTON','NEUTRON','ELECTRON','ORBIT','ELEMENT','COMPOUND','MIXTURE','ENERGY','FORCE','GRAVITY'],
            'WILDLIFE': ['ELEPHANT','TIGER','LION','BEAR','WOLF','DEER','FOX','RABBIT','HAWK','EAGLE','SNAKE','GORILLA','ZEBRA','GIRAFFE','PANDA'],
        },
        'normal': 2, 'hard': 1, 'bonus_normal': 0, 'bonus_hard': 0,
        'cover': COVERS['nature'], 'bg': BGS['bg1'], 'pbg': PBGS['pbg2'],
    },
    {
        'name': 'Cultural_Journey',
        'words': {'CULTURE': ['MUSIC','DANCE','PAINTING','SCULPTURE','THEATRE','CINEMA','LITERATURE','POETRY','FOLKLORE','MYTHOLOGY','FESTIVAL','CUISINE','FASHION','ARCHITECTURE','LANGUAGE','TRADITION','HERITAGE','RITUAL','MELODY','RHYTHM']},
        'normal': 0, 'hard': 3, 'bonus_normal': 1, 'bonus_hard': 0,
        'cover': COVERS['culture'], 'bg': BGS['bg2'], 'pbg': PBGS['pbg3'],
    },
    {
        'name': 'Astronomy_Explorer',
        'words': {'ASTRONOMY': ['STAR','PLANET','MOON','SUN','COMET','ASTEROID','GALAXY','NEBULA','ORBIT','ECLIPSE','TELESCOPE','SATELLITE','CONSTELLATION','METEOR','SUPERNOVA','BLACKHOLE','SOLAR','LUNAR','COSMIC','ASTRONAUT']},
        'normal': 2, 'hard': 0, 'bonus_normal': 2, 'bonus_hard': 0,
        'cover': COVERS['space'], 'bg': BGS['bg2'], 'pbg': PBGS['pbg1'],
    },
    {
        'name': 'Mega_Puzzle_Book',
        'words': {
            'SPORTS': ['FOOTBALL','BASKETBALL','TENNIS','SWIMMING','SOCCER','BASEBALL','VOLLEYBALL','GOLF','HOCKEY','RUGBY'],
            'SCIENCE': ['MOLECULE','ELECTRON','NEUTRON','PROTON','ELEMENT','COMPOUND','MIXTURE','ENERGY','GRAVITY'],
            'WILDLIFE': ['ELEPHANT','TIGER','LION','BEAR','WOLF','DEER','FOX','RABBIT','HAWK','EAGLE'],
            'CULTURE': ['PAINTING','THEATRE','CINEMA','LITERATURE','FOLKLORE','HERITAGE','FESTIVAL','CUISINE','FASHION'],
            'ASTRONOMY': ['PLANET','ASTEROID','GALAXY','NEBULA','ECLIPSE','TELESCOPE','SATELLITE','CONSTELLATION'],
        },
        'normal': 2, 'hard': 1, 'bonus_normal': 1, 'bonus_hard': 1,
        'cover': COVERS['mixed'], 'bg': BGS['bg3'], 'pbg': PBGS['pbg2'],
    },
    {
        'name': 'Sports_Deluxe',
        'words': {'SPORTS': ['FOOTBALL','BASKETBALL','TENNIS','SWIMMING','SOCCER','BASEBALL','VOLLEYBALL','GOLF','HOCKEY','RUGBY','CRICKET','BADMINTON','BOXING','KARATE','JUDO']},
        'normal': 2, 'hard': 1, 'bonus_normal': 1, 'bonus_hard': 0,
        'cover': COVERS['sports'], 'bg': BGS['bg3'], 'pbg': PBGS['pbg3'],
    },
    {
        'name': 'Nature_Explorer',
        'words': {'WILDLIFE': ['ELEPHANT','TIGER','LION','BEAR','WOLF','DEER','FOX','RABBIT','HAWK','EAGLE','SNAKE','GORILLA','ZEBRA','GIRAFFE','PANDA','KOALA']},
        'normal': 2, 'hard': 1, 'bonus_normal': 0, 'bonus_hard': 0,
        'cover': COVERS['nature'], 'bg': BGS['bg1'], 'pbg': PBGS['pbg2'],
    },
    {
        'name': 'Mixed_Collection',
        'words': {
            'SCIENCE': ['ATOM','CELL','GENE','DNA','PROTON','ENERGY','FORCE','ORBIT'],
            'CULTURE': ['MUSIC','DANCE','PAINTING','POETRY','THEATRE','FESTIVAL','HERITAGE'],
            'ASTRONOMY': ['STAR','MOON','PLANET','COMET','GALAXY','NEBULA','ORBIT'],
        },
        'normal': 1, 'hard': 1, 'bonus_normal': 0, 'bonus_hard': 0,
        'cover': COVERS['mixed'], 'bg': BGS['bg3'], 'pbg': PBGS['pbg3'],
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
        'cover_id': cfg['cover'],
        'background_id': cfg['bg'],
        'puzzle_bg_id': cfg['pbg'],
    }
    outpath = os.path.join(OUT, f"{cfg['name']}.pdf")
    generate_pdf(cfg['name'], payload, outpath)
    time.sleep(25)

print("\nDONE! All PDFs generated.")
