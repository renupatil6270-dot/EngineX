from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


def _clean_items(items: list[str] | None) -> list[str]:
    if not items:
        return []
    cleaned: list[str] = []
    for item in items:
        value = " ".join(item.split())
        if value and value.casefold() not in {entry.casefold() for entry in cleaned}:
            cleaned.append(value)
    return cleaned


class QuizAnswers(BaseModel):
    model_config = ConfigDict(extra="forbid")

    interestedDomain: str = Field(min_length=1, max_length=120)
    specialization: str | None = Field(default=None, max_length=120)
    targetRoles: list[str] = Field(default_factory=list, max_length=10)
    desiredSkills: list[str] = Field(default_factory=list, max_length=30)
    acquiredSkills: list[str] = Field(default_factory=list, max_length=30)
    primaryGoal: str | None = Field(default=None, max_length=500)
    timelineMonths: int = Field(ge=1, le=60)

    @field_validator(
        "interestedDomain",
        "specialization",
        "primaryGoal",
        mode="before",
    )
    @classmethod
    def normalize_text(cls, value: str | None) -> str | None:
        if value is None:
            return value
        normalized = " ".join(value.split())
        if not normalized:
            raise ValueError("text values cannot be blank")
        return normalized

    @field_validator("targetRoles", "desiredSkills", "acquiredSkills")
    @classmethod
    def normalize_items(cls, value: list[str]) -> list[str]:
        return _clean_items(value)


class RoadmapRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    userId: str | None = Field(default=None, max_length=128)
    portalType: Literal["dreamer", "pursuer"]
    answers: QuizAnswers


class SkillGap(BaseModel):
    skill: str
    priority: Literal["high", "medium", "low"]
    reason: str


class Resource(BaseModel):
    title: str
    url: str | None = None


class RoadmapPhase(BaseModel):
    month: int = Field(ge=1)
    title: str
    skills: list[str]
    activities: list[str]
    resources: list[Resource]
    deliverable: str


class ProjectRecommendation(BaseModel):
    title: str
    difficulty: Literal["beginner", "intermediate", "advanced"]
    skills: list[str]


class RoadmapResponse(BaseModel):
    title: str
    summary: str
    targetRole: str
    durationMonths: int = Field(ge=1)
    skillGaps: list[SkillGap]
    phases: list[RoadmapPhase]
    projects: list[ProjectRecommendation]
    assumptions: list[str]
    generatedAt: datetime
