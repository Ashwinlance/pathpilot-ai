import { useState } from 'react';
import { Check, RefreshCw, Trash2 } from 'lucide-react';
import type { GeneratedMCQ } from '../lib/mcqGenerator';

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function MCQCard({ question, index, isReviewerMode = false, selectedAnswer, onSelectAnswer, isSubmitted = false, onAccept, onDelete, onRegenerate }: { question: GeneratedMCQ; index: number; isReviewerMode?: boolean; selectedAnswer?: number; onSelectAnswer?: (optionIndex: number) => void; isSubmitted?: boolean; onAccept?: () => void; onDelete?: () => void; onRegenerate?: () => void; }) {
  const [editing, setEditing] = useState(false);
  const [qText, setQText] = useState(question.question);
  const difficultyColors = {
    Beginner: 'bg-[hsl(155_32%_88%)] text-[hsl(162_46%_27%)]',
    Intermediate: 'bg-[hsl(42_72%_85%)] text-[hsl(30_48%_28%)]',
    Advanced: 'bg-[hsl(13_70%_90%)] text-[hsl(13_58%_40%)]',
  };
  return <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4" data-testid={`mcq-card-${question.id}`}>
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3"><div className="flex items-center gap-2"><span className="font-mono text-xs font-bold text-primary">Q{index + 1}</span><span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[10px] font-semibold text-foreground">{question.concept}</span><span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">{question.competencyName}</span></div><span className={cx('inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider', difficultyColors[question.difficulty])}>{question.difficulty}</span></div>
    <div>{!editing ? <p className="font-serif font-bold text-lg leading-7 text-foreground">{question.question}</p> : <textarea value={qText} onChange={e => setQText(e.target.value)} className="w-full rounded-xl border border-input bg-background p-3 text-sm font-semibold outline-none focus:border-primary" rows={2} />}</div>
    <div className="space-y-2">{question.options.map((opt, optIndex) => { const isSelected = selectedAnswer === optIndex; const isCorrect = question.correctAnswer === optIndex; const showAnswer = isReviewerMode || isSubmitted; return <button key={opt} type="button" disabled={isSubmitted || isReviewerMode} onClick={() => onSelectAnswer?.(optIndex)} className={cx('w-full flex items-center justify-between rounded-xl border p-3 text-left text-xs font-semibold transition', isSelected && !showAnswer && 'border-primary bg-primary/10 text-primary font-bold', showAnswer && isCorrect && 'border-[hsl(162_46%_40%)] bg-[hsl(155_32%_90%)] text-[hsl(162_46%_25%)] font-bold', showAnswer && isSelected && !isCorrect && 'border-accent bg-accent/10 text-accent font-bold', !isSelected && (!showAnswer || !isCorrect) && 'border-border bg-background hover:bg-secondary/60')}><span><strong className="mr-2 font-mono text-muted-foreground">{String.fromCharCode(65 + optIndex)}.</strong>{opt}</span>{showAnswer && isCorrect && <span className="font-bold text-[hsl(162_46%_25%)]">✓ Correct</span>}{showAnswer && isSelected && !isCorrect && <span className="font-bold text-accent">× Your Answer</span>}</button>; })}</div>
    {(isReviewerMode || isSubmitted) && <div className="rounded-xl bg-secondary/70 p-3.5 text-xs space-y-1"><span className="font-bold text-foreground">Explanation:</span><p className="text-muted-foreground leading-5">{question.explanation}</p></div>}
    {isReviewerMode && <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs"><span className="text-[11px] text-muted-foreground">Source: {question.sourceMaterial}</span><div className="flex items-center gap-2">{onRegenerate && <button onClick={onRegenerate} className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-muted-foreground hover:bg-secondary hover:text-foreground"><RefreshCw size={12} /> Regenerate</button>}{onDelete && <button onClick={onDelete} className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-accent hover:bg-accent/10"><Trash2 size={12} /> Delete</button>}{onAccept && <button onClick={onAccept} className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1 font-bold text-primary hover:bg-primary hover:text-primary-foreground"><Check size={12} /> Accept Question</button>}</div></div>}
  </div>;
}