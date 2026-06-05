from fastapi import APIRouter

router = APIRouter()

@router.get("/settings")
def get_settings():
    return {
        "difficulties": ["Normal", "Hard"],
        "bonus_modes": ["Normal", "Hard"],
        "default_counts": {
            "normal": 5,
            "hard": 2,
            "bonus_normal": 1,
            "bonus_hard": 1
        },
        "words_per_puzzle": {
            "normal": 12,
            "hard": 20
        },
        "mask_types": [None, "circle", "squares"],
        "page_sizes": {"Normal": 13, "Hard": 17}
    }
