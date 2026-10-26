# EngineX

EngineX bridges the gap between academic theory and industry readiness for
engineering students through authenticated learner profiles and generated
learning roadmaps.

## Local development

The application has three parts:

- `Backend`: Express, MongoDB, JWT authentication, quiz and roadmap persistence.
- `ai_engine`: FastAPI roadmap generation service.
- `Frontend/enginex-frontend`: Vite React client.

Start the AI service first:

```powershell
cd ai_engine
py -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
```

Configure and start the backend:

```powershell
cd Backend
npm install
Copy-Item .env.example .env
npm start
```

Set `MONGODB_URI` and a strong `JWT_SECRET` in `Backend/.env`; startup fails
explicitly if either is missing. The frontend defaults to
`http://localhost:5000/api`; set `VITE_API_URL` in
`Frontend/enginex-frontend/.env` when deploying elsewhere.

```powershell
cd Frontend/enginex-frontend
npm install
npm run dev
```

## Checks

```powershell
cd ai_engine
py -m pytest
cd ..\Frontend\enginex-frontend
npm run lint
npm run build
```
