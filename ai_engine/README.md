# EngineX AI Engine

FastAPI service for generating structured learning roadmaps from EngineX quiz
profiles. The first implementation is provider-agnostic and uses a deterministic
roadmap generator so the service can be integrated and tested before an external
LLM is configured.

## Run locally

From the repository root:

```powershell
cd ai_engine
py -m venv .venv
.\.venv\Scripts\python -m pip install -r requirements.txt
.\.venv\Scripts\python -m uvicorn app.main:app --reload --port 8000
```

The service is available at `http://localhost:8000`. OpenAPI documentation is
available at `/docs`.

## Endpoints

- `GET /health` - liveness check.
- `POST /api/v1/roadmap/generate` - validate a quiz profile and return a
  structured roadmap.

Example request:

```json
{
  "userId": "optional-user-id",
  "portalType": "dreamer",
  "answers": {
    "interestedDomain": "Computer Science",
    "specialization": "Artificial Intelligence",
    "targetRoles": ["ML Engineer"],
    "desiredSkills": ["Python", "Machine Learning"],
    "acquiredSkills": ["JavaScript"],
    "primaryGoal": "Get an internship",
    "timelineMonths": 6
  }
}
```

## Tests

```powershell
cd ai_engine
py -m pip install -r requirements-dev.txt
py -m pytest
```

The generated roadmap is intentionally deterministic. Replace
`RoadmapService` with an LLM-backed implementation after the API contract is
accepted by the Node backend. Keep the response schema and validation in place
for all providers.
