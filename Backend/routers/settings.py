from fastapi import APIRouter

router = APIRouter()

@router.get("/settings")
def get_settings():
    return {
        "difficulties": ["Normal", "Hard"],
        "bonus_modes": ["Normal", "Hard"],
        "default_counts": {
            "normal": 10,
            "hard": 5,
            "bonus_normal": 1,
            "bonus_hard": 1
        },
        "mask_types": [None, "circle", "squares"],
        "page_sizes": {"Normal": 13, "Hard": 17}
    }
