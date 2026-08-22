from fastapi import APIRouter

router = APIRouter()


@router.get("/settings")
def get_settings():
    """Describe the generation rules the backend actually applies."""
    return {
        "difficulties": ["Normal", "Hard"],
        "bonus_modes": ["Normal", "Hard"],
        "default_counts": {"normal": 10, "hard": 5, "bonus_normal": 1, "bonus_hard": 1},
        "max_count_per_mode": 100,
        "grid_sizes": {"Normal": 13, "Hard": 17, "Bonus Normal": 13, "Bonus Hard": 17},
        # A puzzle whose words cannot be placed grows by 2 cells, at most twice
        "max_grid_growth": 4,
        "word_lengths": {"Normal": [4, 11], "Hard": [6, 15]},
        # Words per puzzle are spread evenly over the topic's word pool, up to these caps
        "max_words_per_puzzle": {"Normal": 12, "Hard": 20},
        "bonus_mask": "circle",
    }
