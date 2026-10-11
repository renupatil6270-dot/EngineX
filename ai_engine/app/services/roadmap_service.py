from datetime import datetime, timezone

from app.schemas import (
    ProjectRecommendation,
    QuizAnswers,
    Resource,
    RoadmapPhase,
    RoadmapRequest,
    RoadmapResponse,
    SkillGap,
)


class RoadmapService:
    """Deterministic baseline; an LLM adapter can implement the same contract later."""

    def generate(self, request: RoadmapRequest) -> RoadmapResponse:
        answers = request.answers
        target_role = answers.targetRoles[0] if answers.targetRoles else "Engineering professional"
        acquired = {skill.casefold() for skill in answers.acquiredSkills}
        gaps = [
            SkillGap(
                skill=skill,
                priority="high" if index < 2 else "medium",
                reason=f"{skill} supports the target role: {target_role}.",
            )
            for index, skill in enumerate(
                skill for skill in answers.desiredSkills if skill.casefold() not in acquired
            )
        ]
        focus_skills = [gap.skill for gap in gaps] or answers.acquiredSkills[:3] or [
            "Core engineering"
        ]
        phase_count = min(answers.timelineMonths, max(1, len(focus_skills)))
        phases = [
            RoadmapPhase(
                month=month,
                title=f"{focus_skills[(month - 1) % len(focus_skills)]} foundations",
                skills=focus_skills[: min(3, len(focus_skills))],
                activities=[
                    f"Study core {focus_skills[(month - 1) % len(focus_skills)]} concepts",
                    "Complete a practical exercise and document the result",
                ],
                resources=[Resource(title="Official documentation", url=None)],
                deliverable="Publish a small project or progress summary",
            )
            for month in range(1, phase_count + 1)
        ]
        return RoadmapResponse(
            title=f"{answers.timelineMonths}-Month {target_role} Roadmap",
            summary=(
                f"A learning plan for {answers.interestedDomain} focused on "
                f"{target_role} and the user's stated goal."
            ),
            targetRole=target_role,
            durationMonths=answers.timelineMonths,
            skillGaps=gaps,
            phases=phases,
            projects=[
                ProjectRecommendation(
                    title=f"{target_role} portfolio project",
                    difficulty="beginner",
                    skills=focus_skills[:3],
                )
            ],
            assumptions=[
                "The learner can study consistently throughout the selected timeline.",
            ],
            generatedAt=datetime.now(timezone.utc),
        )
