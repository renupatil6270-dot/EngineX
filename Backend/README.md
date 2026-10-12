# EngineX backend

## Setup

1. Install Node.js dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set a real `MONGODB_URI` and long,
   random `JWT_SECRET`. The server refuses to start when either value is missing.
3. Start the FastAPI AI engine from `ai_engine` (see its README).
4. Run `npm start` (or `npm run dev`).

The API listens on port 5000 by default. Auth endpoints are available at
`/api/auth/signup`, `/api/auth/login`, and `/api/auth/me`. Authenticated quiz
submissions use `/api/quiz/submit`; generated roadmaps are available through
`/api/roadmaps`.
