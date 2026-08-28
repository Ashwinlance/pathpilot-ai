import { useEffect, useState } from 'react';
import { Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
import { MCQCard } from '../components/MCQCard';
import { mcqGenerator, type ExtractedMaterial, type GeneratedMCQ, SAMPLE_MATERIALS } from '../lib/mcqGenerator';

export function MCQGeneratorPage({
  material,
  onPublishQuestions,
  go,
}: {
  material?: ExtractedMaterial;
  onPublishQuestions: (questions: GeneratedMCQ[]) => void;
  go: (path: string) => void;
}) {
  const activeMaterial = material || SAMPLE_MATERIALS[0];
  const [questions, setQuestions] = useState<GeneratedMCQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    void mcqGenerator.generateQuestions(activeMaterial).then(res => {
      setQuestions(res);
      setLoading(false);
    });
  }, [activeMaterial]);

  const handleRegenerateOne = (id: string) => {
    setQuestions(current =>
      current.map(q =>
        q.id === id
          ? { ...q, question: `${q.question} (Regenerated variant)` }
          : q
      )
    );
  };

  const handleDeleteOne = (id: string) => {
    setQuestions(current => current.filter(q => q.id !== id));
  };

  const handlePublish = () => {
    onPublishQuestions(questions);
    go('/assessment');
  };

  const beginnerCount = questions.filter(q => q.difficulty === 'Beginner').length;
  const intermediateCount = questions.filter(q => q.difficulty === 'Intermediate').length;
  const advancedCount = questions.filter(q => q.difficulty === 'Advanced').length;

  return (
    <div className="mx-auto max-w-5xl space-y-8" data-testid="page-mcq-generator">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-5 rounded-[1.8rem] border border-border bg-card p-6 shadow-sm sm:p-8 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Sparkles size={14} />
            <span>AI MCQ Generator & Review Suite</span>
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-[-.03em] text-foreground sm:text-4xl">
            Review Generated Assessment Questions
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Generated from <strong className="text-foreground">{activeMaterial.title}</strong>. Review, edit, or regenerate questions before publishing the quiz.
          </p>
        </div>
        <button
          onClick={handlePublish}
          disabled={questions.length === 0}
          data-testid="button-publish-quiz"
          className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:brightness-110 active:translate-y-px disabled:opacity-40"
        >
          <span>Publish & Take Assessment</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid gap-4 sm:grid-cols-4 text-xs font-semibold">
        <div className="rounded-2xl border border-border bg-card p-4">
          <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Total Generated</span>
          <p className="font-serif text-2xl font-bold text-foreground mt-1">{questions.length} Questions</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Beginner Level</span>
          <p className="font-serif text-2xl font-bold text-[hsl(162_46%_27%)] mt-1">{beginnerCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Intermediate Level</span>
          <p className="font-serif text-2xl font-bold text-[hsl(30_48%_28%)] mt-1">{intermediateCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Advanced Level</span>
          <p className="font-serif text-2xl font-bold text-accent mt-1">{advancedCount}</p>
        </div>
      </div>

      {/* Questions Review List */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
          <RefreshCw size={20} className="mr-2 animate-spin text-primary" />
          <span>Generating competency-mapped MCQs from material...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-serif text-2xl font-bold">Review & Edit Suite</h2>
            <span className="text-xs text-muted-foreground">Click options to edit question parameters</span>
          </div>
          <div className="space-y-5">
            {questions.map((q, idx) => (
              <MCQCard
                key={q.id}
                question={q}
                index={idx}
                isReviewerMode={true}
                onRegenerate={() => handleRegenerateOne(q.id)}
                onDelete={() => handleDeleteOne(q.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
