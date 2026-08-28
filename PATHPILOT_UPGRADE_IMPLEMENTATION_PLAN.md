# PathPilot (SIH26101 — MoSPI) Complete Upgrade Implementation Plan

PathPilot is an AI-Driven Personalised Adaptive Learning & Competency Development Platform built for India's Official Statistical System (MoSPI) under Smart India Hackathon (SIH26101).

This implementation plan connects the MoSPI professional competency framework, skill-gap analysis, iGOT Karmayogi / NSSTA training recommendations, document-based AI MCQ generation, workforce analytics, the existing 7-stage adaptive learning loop, and AI Learning Copilot.

## Architecture

MoSPI Professional Learner Profile → Role Competency Mapping & Skill-Gap Engine → iGOT / NSSTA Training Recommendation Engine + PathPilot 7-Stage Adaptive Loop → Material Upload → AI MCQ Generator → Quiz Module → Learner Progress Radar & Admin Workforce Analytics.

## Planned Core Services

- `competencyFramework.ts` — MoSPI statistical, technical, digital governance, and behavioural/managerial competency domains and role requirements.
- `skillGapEngine.ts` — percentage gap calculation, priority assignment, and gap explanations.
- `trainingRepository.ts` — demo iGOT Karmayogi and NSSTA course repository.
- `recommendationEngine.ts` — matches skill gaps with relevant training and explains recommendations.
- `mcqGenerator.ts` — concept extraction and competency-mapped MCQ generation.
- `assessmentEngine.ts` — evaluates quizzes and updates learner competency state.
- `adaptiveEngine.ts` — connects adaptive mastery with MoSPI competency state.
- `learningCopilotService.ts` — provides context-aware AI responses using role, gaps, courses, and prerequisite status.

## Planned UI Components

`CompetencyRadar.tsx`, `CompetencyCard.tsx`, `SkillGapCard.tsx`, `TrainingRecommendationCard.tsx`, `MaterialUploader.tsx`, `MCQCard.tsx`, and `WorkforceAnalytics.tsx`.

## Planned Pages

`ProfilePage.tsx`, `CompetencyProfilePage.tsx`, `TrainingRecommendationsPage.tsx`, `MaterialUploadPage.tsx`, `MCQGeneratorPage.tsx`, `AdminDashboard.tsx`, and `ProgressPage.tsx`.

## Verification Goals

- Run the web application on `http://localhost:3000`.
- Verify TypeScript and console errors across routes.
- Verify profile and competency mapping.
- Verify skill-gap ranking and recommendations.
- Verify material upload → MCQ generation → competency updates.
- Verify synchronization with the existing 7-stage adaptive learning loop and AI Copilot.
- Verify administrator workforce analytics.

## Prototype Transparency

All prototype iGOT courses, NSSTA modules, and government organizational metrics are to be clearly labelled as Demo Data.
