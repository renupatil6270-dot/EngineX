from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def _payload() -> dict:
    return {
        "portalType": "dreamer",
        "answers": {
            "interestedDomain": "Computer Science",
            "targetRoles": ["ML Engineer"],
            "desiredSkills": ["Python", "Machine Learning", "Python"],
            "acquiredSkills": ["JavaScript"],
            "primaryGoal": "Get an internship",
            "timelineMonths": 6,
        },
    }


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_generate_roadmap_returns_structured_response() -> None:
    response = client.post("/api/v1/roadmap/generate", json=_payload())
    body = response.json()
    assert response.status_code == 200
    assert body["targetRole"] == "ML Engineer"
    assert body["durationMonths"] == 6
    assert [gap["skill"] for gap in body["skillGaps"]] == ["Python", "Machine Learning"]
    assert len(body["phases"]) == 2


def test_invalid_portal_type_is_rejected() -> None:
    payload = _payload()
    payload["portalType"] = "unknown"
    response = client.post("/api/v1/roadmap/generate", json=payload)
    assert response.status_code == 422


def test_unknown_fields_are_rejected() -> None:
    payload = _payload()
    payload["answers"]["unexpected"] = "value"
    response = client.post("/api/v1/roadmap/generate", json=payload)
    assert response.status_code == 422


def test_generate_roadmap_handles_empty_skill_lists() -> None:
    payload = _payload()
    payload["answers"]["desiredSkills"] = []
    payload["answers"]["acquiredSkills"] = []
    response = client.post("/api/v1/roadmap/generate", json=payload)
    assert response.status_code == 200
    assert response.json()["phases"][0]["skills"] == ["Core engineering"]
