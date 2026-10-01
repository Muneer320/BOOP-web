# BOOP Web — frontend

React app for [BOOP Web](../README.md). It talks to the FastAPI backend in `../Backend`.

```bash
npm install
cp .env.example .env    # points REACT_APP_API_URL at http://localhost:8000/api
npm start               # http://localhost:3000
npm test                # Jest + Testing Library
npm run build           # production build in build/
```

Production builds on Vercel set `REACT_APP_API_URL` to the Hugging Face Space
(`https://muneer320-boop-backend.hf.space/api`).

| Folder | Contents |
|---|---|
| `src/components/` | Pages (Home, Create, Play, Examples, About) and UI components |
| `src/components/pages/` | Play area and the legal pages |
| `src/context/` | Book-generation progress (shown on every page) and theme |
| `src/hooks/` | Game timer and saved-game persistence |
| `src/services/api.js` | Axios client for the backend |
| `public/examples/` | Sample PDF books and covers for the Examples page |
