import type { GeneratedMCQ } from './mcqGenerator';

export type CompetencyImpact = {
  competencyId: string;
  competencyName: string;
  beforeScore: number;
  afterScore: number;
  improvement: number;
};

export type AssessmentResult = {
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  scorePercentage: number;
  competencyImpacts: CompetencyImpact[];
  updatedDemonstratedCompetencies: Record<string, number>;
  feedbackMessage: string;
  recommendedNextStep: 'continue_roadmap' | 'prerequisite_repair' | 'explore_training';
};

export function evaluateAssessment(
  questions: GeneratedMCQ[],
  learnerAnswers: Record<string, number>,
  currentCompetencies: Record<string, number>
): AssessmentResult {
  let correctCount = 0;
  const compStats: Record<string, { total: number; correct: number; name: string }> = {};

  questions.forEach(q => {
    const selected = learnerAnswers[q.id];
    const isCorrect = selected === q.correctAnswer;
    if (isCorrect) correctCount++;

    if (!compStats[q.competencyId]) {
      compStats[q.competencyId] = { total: 0, correct: 0, name: q.competencyName };
    }

    compStats[q.competencyId].total += 1;
    if (isCorrect) compStats[q.competencyId].correct += 1;
  });

  const totalQuestions = questions.length;
  const scorePercentage = totalQuestions > 0
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0;

  const updatedDemonstratedCompetencies = { ...currentCompetencies };
  const competencyImpacts: CompetencyImpact[] = [];

  // newScore = round(existingScore * 0.7 + assessmentScore * 0.3)
  for (const [compId, stat] of Object.entries(compStats)) {
    const beforeScore = currentCompetencies[compId] ?? 35;
    const assessmentCompScore = Math.round((stat.correct / stat.total) * 100);
    const afterScore = Math.min(
      100,
      Math.max(0, Math.round(beforeScore * 0.7 + assessmentCompScore * 0.3))
    );

    updatedDemonstratedCompetencies[compId] = afterScore;
    competencyImpacts.push({
      competencyId: compId,
      competencyName: stat.name,
      beforeScore,
      afterScore,
      improvement: afterScore - beforeScore,
    });
  }

  let feedbackMessage = '';
  let recommendedNextStep: AssessmentResult['recommendedNextStep'] = 'continue_roadmap';

  if (scorePercentage >= 85) {
    feedbackMessage = `Outstanding performance! You demonstrated strong mastery across ${competencyImpacts.map(c => c.competencyName).join(', ')}. Your competency signal has improved.`;
    recommendedNextStep = 'continue_roadmap';
  } else if (scorePercentage >= 60) {
    feedbackMessage = 'Solid result. You demonstrated baseline understanding, with room for targeted improvement in prerequisite concepts.';
    recommendedNextStep = 'explore_training';
  } else {
    feedbackMessage = 'Partial understanding detected. The adaptive engine has flagged prerequisite concepts for repair.';
    recommendedNextStep = 'prerequisite_repair';
  }

  return {
    totalQuestions,
    correctCount,
    incorrectCount: totalQuestions - correctCount,
    scorePercentage,
    competencyImpacts,
    updatedDemonstratedCompetencies,
    feedbackMessage,
    recommendedNextStep,
  };
}
