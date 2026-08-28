import { type ReactNode, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Award, BookOpen, Bot, BrainCircuit, Check, CheckCircle2,
import { MCQGeneratorPage } from './pages/MCQGeneratorPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';
import { calculateSkillGaps } from './lib/skillGapEngine';
import { getTrainingRecommendations } from './lib/recommendationEngine';
import { getWorkforceAnalyticsSummary } from './lib/workforceAnalytics';
import { SAMPLE_MATERIALS, type ExtractedMaterial, type GeneratedMCQ } from './lib/mcqGenerator';
import type { AssessmentResult } from './lib/assessmentEngine';
import { loadJudgeDemo, resetJudgeDemo, getJudgeDemoState, JUDGE_DEMO_PROFILE, JUDGE_DEMO_COMPETENCIES, JUDGE_DEMO_TOPICS } from './lib/sihDemoScenario';

// Uploaded PathPilot source snapshot. The source references modular components under pages/, components/, and lib/.
export default function App() {
  const [demoState, setDemoState] = useState(() => getJudgeDemoState());
  return (
    <main>
      <h1>PathPilot AI</h1>
      <p>Adaptive Learning Platform — SIH26101</p>
      <pre>{JSON.stringify(demoState, null, 2)}</pre>
    </main>
  );
}
