from fastapi import FastAPI

from app.config import get_settings
from app.schemas import RoadmapRequest, RoadmapResponse
from app.services.roadmap_service import RoadmapService

settings = get_settings()
app = FastAPI(
    title="EngineX AI Engine",
    version="0.1.0",
    description="Structured roadmap generation for EngineX learner profiles.",
)
roadmap_service = RoadmapService()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": settings.service_name}


@app.post("/api/v1/roadmap/generate", response_model=RoadmapResponse)
def generate_roadmap(request: RoadmapRequest) -> RoadmapResponse:
    return roadmap_service.generate(request)
