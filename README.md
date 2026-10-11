# EngineX

EngineX bridges academic theory and industry reality for engineering students
with authenticated learning roadmaps.

## Architecture

```text
React/Vite frontend → Express backend → MongoDB
                                  ↘ FastAPI AI engine
```

The backend owns authentication, quiz submissions, and roadmap persistence. The
AI engine validates quiz profiles and returns a structured roadmap. The current
AI implementation is deterministic so the complete flow works without paid
provider credentials; an LLM adapter can replace it later.

## Prerequisites

- Node.js 18+
- Python 3.11+
- MongoDB running locally or a MongoDB connection string

## Configuration

Copy `Backend/.env.example` to `Backend/.env` and set a long random
`JWT_SECRET`. Copy `Frontend/enginex-frontend/.env.example` to
`Frontend/enginex-frontend/.env` if the API is not running at its default URL.
Do not commit `.env` files or secrets.

## Run locally

Start the AI engine:

```powershell
cd ai_engine
py -m pip install -r requirements-dev.txt
py -m uvicorn app.main:app --reload --port 8000
```

Start the backend in another terminal:

```powershell
cd Backend
npm ci
npm run dev
```

Start the frontend:

```powershell
cd Frontend/enginex-frontend
npm ci
npm run dev
```

Open `http://localhost:5173`. The flow is signup → portal → Dreamer Quiz →
roadmap. Saved roadmaps can be retrieved from the Achiever Dashboard.

## API overview

- `GET /health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/quiz/submit`
- `GET /api/roadmap`
- `GET /health` on the AI service
- `POST /api/v1/roadmap/generate` on the AI service

Protected endpoints require `Authorization: Bearer <token>`.

## Validation

```powershell
cd ai_engine
py -m pytest

cd ../Frontend/enginex-frontend
npm run lint
npm run build

cd ../../Backend
node --check server.js
node --check routes/auth.js
node --check routes/quiz.js
node --check routes/roadmap.js
```
