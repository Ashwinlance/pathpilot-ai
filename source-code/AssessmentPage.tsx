import { useState } from 'react';
import { Award, CheckCircle2, BookOpen, Gauge } from 'lucide-react';
import { MCQCard } from '../components/MCQCard';
import { evaluateAssessment, type AssessmentResult } from '../lib/assessmentEngine';
import type { GeneratedMCQ } from '../lib/mcqGenerator';

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function AssessmentPage({
  questions,
  demonstratedCompetencies,
  onCompleteAssessment,
  go,
}: {
  questions: GeneratedMCQ[];
  demonstratedCompetencies: Record<string, number>;
  onCompleteAssessment: (result: AssessmentResult) => void;
  go: (path: string) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const activeQuestions = questions && questions.length > 0 ? questions : [
    { id: 'demo_1', question: 'Which SQL clause is used to filter individual survey records before aggregation?', options: ['HAVING', 'WHERE', 'ORDER BY', 'GROUP BY'], correctAnswer: 1, explanation: 'WHERE filters individual records prior to aggregation.', difficulty: 'Beginner' as const, concept: 'SQL Querying', competencyId: 'tech_sql', competencyName: 'SQL & Database Querying', sourceMaterial: 'MoSPI SQL Guide' },
    { id: 'demo_2', question: 'Which Pandas function loads an official micro-data CSV file into a DataFrame?', options: ['pd.open_csv()', 'pd.read_csv()', 'pd.parse_csv()', 'pd.load_csv()'], correctAnswer: 1, explanation: 'pd.read_csv() imports CSV tables into Pandas DataFrames.', difficulty: 'Beginner' as const, concept: 'DataFrames', competencyId: 'tech_python', competencyName: 'Python Programming', sourceMaterial: 'Python Guide' },
  ];

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    const res = evaluateAssessment(activeQuestions, answers, demonstratedCompetencies);
    setResult(res);
    setSubmitted(true);
    onCompleteAssessment(res);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8" data-testid="page-assessment">
      <div className="flex flex-col justify-between gap-4 rounded-[1.8rem] border border-border bg-card p-6 shadow-sm sm:p-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary"><Award size={14} /><span>Competency-Aware Assessment</span></div>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-[-.03em] text-foreground sm:text-4xl">{submitted ? 'Assessment Performance Results' : 'Official Statistical System Assessment'}</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{submitted ? 'Your answers have been evaluated and your MoSPI demonstrated competency scores have updated.' : 'Answer the generated questions below to evaluate your competency and update your skill gap profile.'}</p>
        </div>
      </div>

      {submitted && result && (
        <div className="space-y-6" data-testid="assessment-results">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-5"><span className="text-xs font-semibold text-muted-foreground">Overall Assessment Score</span><p className="mt-2 font-serif text-4xl font-bold text-primary">{result.scorePercentage}%</p><p className="mt-1 text-xs text-muted-foreground">{result.correctCount} of {result.totalQuestions} correct</p></div>
            <div className="rounded-2xl border border-border bg-card p-5 sm:col-span-2 space-y-2"><span className="text-xs font-semibold text-muted-foreground">Adaptive Engine Feedback</span><p className="font-serif text-lg font-bold text-foreground">{result.feedbackMessage}</p></div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <h3 className="font-serif text-xl font-bold">Competency Impact Analysis</h3>
            <div className="space-y-3">{result.competencyImpacts.map(impact => <div key={impact.competencyId} className="flex items-center justify-between rounded-xl border border-border bg-secondary/50 p-3.5 text-xs"><div><span className="font-bold text-sm text-foreground block">{impact.competencyName}</span><span className="text-muted-foreground">Before: {impact.beforeScore}% → <strong className="text-foreground">After: {impact.afterScore}%</strong></span></div><span className={cx('font-mono text-xs font-bold rounded-full px-3 py-1', impact.improvement >= 0 ? 'bg-[hsl(155_32%_88%)] text-[hsl(162_46%_27%)]' : 'bg-accent/15 text-accent')}>{impact.improvement >= 0 ? `+${impact.improvement}pt Improvement` : `${impact.improvement}pt Difference`}</span></div>)}</div>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button onClick={() => go('/competency')} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-primary-foreground shadow-sm transition hover:brightness-110"><Award size={16} /><span>View Updated Competency Profile</span></button>
            <button onClick={() => go('/training')} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-xs font-bold text-foreground transition hover:bg-secondary"><BookOpen size={16} /><span>View Recalculated Training Feed</span></button>
            <button onClick={() => go('/roadmap')} className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-xs font-bold text-foreground transition hover:bg-secondary"><Gauge size={16} /><span>Return to Roadmap</span></button>
          </div>
        </div>
      )}

      <div className="space-y-6">{activeQuestions.map((q, idx) => <MCQCard key={q.id} question={q} index={idx} isReviewerMode={false} selectedAnswer={answers[q.id]} onSelectAnswer={optIdx => handleSelectOption(q.id, optIdx)} isSubmitted={submitted} />)}</div>

      {!submitted && <div className="pt-4"><button onClick={handleSubmit} disabled={Object.keys(answers).length < activeQuestions.length} data-testid="button-submit-assessment" className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-sm transition hover:brightness-110 disabled:opacity-40"><span>Submit Assessment & Update Competencies</span><CheckCircle2 size={16} /></button></div>}
    </div>
  );
}
