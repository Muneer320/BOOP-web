# BOOP Web — Directory Tree Snapshot

**Date:** 2026-06-02

---

```
BOOP-web/
├── .github/workflows/deploy.yml              # Vercel deploy
│
├── Backend/                                   # Python FastAPI
│   ├── Dockerfile                             # HF Spaces deploy
│   ├── app.py                                 # Entry point (55 lines)
│   ├── requirements.txt
│   ├── routers/
│   │   ├── files.py                           # Upload/download (62 lines)
│   │   ├── generate.py                        # Puzzle generation (112 lines)
│   │   ├── settings.py                        # App settings (18 lines)
│   │   ├── status.py                          # Health check (7 lines)
│   │   ├── templates.py                       # Template listing (20 lines)
│   │   └── words.py                           # Topic words (38 lines)
│   ├── boop/                                  # Core puzzle logic
│   │   ├── generatePuzzle.py                  # ⚠️ 783 lines (250 dead) 
│   │   ├── appendImage.py                     # ⚠️ 581 lines (duplicate)
│   │   ├── rawWordToJSON.py                   # Word processing (88 lines)
│   │   ├── index.py                           # Title page (116 lines)
│   │   ├── main.py                            # CLI entry (89 lines)
│   │   ├── Assets/                            # Default images
│   │   └── Words/                             # words.txt + words.json
│   ├── uploads/                               # User file storage
│   └── outputs/                               # Temp puzzle files
│
├── frontend/                                  # React SPA (CRA)
│   ├── package.json
│   ├── .env.development / .env.production
│   ├── public/
│   │   ├── index.html
│   │   └── manifest.json                      # ⚠️ "Create React App Sample"
│   └── src/
│       ├── components/
│       │   ├── PuzzleCreator.js               # ⚠️ 402 lines — monolithic
│       │   ├── WordSelector.js                # ⚠️ 320 lines — complex state
│       │   ├── FileUploader.js                # ❄️ Reusable (122 lines)
│       │   ├── LoadingOverlay.js              # ❄️ Reusable (60 lines)
│       │   ├── GenerationStatus.js            # ❄️ Reusable (82 lines)
│       │   ├── Home.js / Header.js / Footer.js / About.js
│       │   └── pages/
│       │       ├── PrivacyPolicy.js           # ⚠️ 589 lines — bloated
│       │       └── TermsOfService.js          # ⚠️ 1020 lines — bloated
│       ├── context/GenerationContext.js        # Only shared state
│       ├── services/api.js                     # Axios wrapper
│       ├── App.js                              # Routes (48 lines)
│       └── App.test.js                         # ⚠️ Broken test
│
├── README.md
└── LICENSE
```

## Refactor Priority Candidates

| File | Issue | Action |
|------|-------|--------|
| `PrivacyPolicy.js` (589 lines) | Inline legal text | Extract to Markdown |
| `TermsOfService.js` (1020 lines) | Inline legal text | Extract to Markdown |
| `PuzzleCreator.js` (402 lines) | Monolithic | Split into step components |
| `WordSelector.js` (320 lines) | Multi-mode complexity | Extract sub-components |
| `generatePuzzle.py` (783 lines) | ~250 lines dead code | Remove PIL comments |
| `appendImage.py` (581 lines) | 3 duplicate implementations | Consolidate |
| `App.test.js` | Broken test | Fix to test actual app |
| `manifest.json` | CRA defaults | Update branding |
