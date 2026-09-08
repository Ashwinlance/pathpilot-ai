import { BookOpen, Clock, Award, ArrowRight, Sparkles } from 'lucide-react';
import type { RecommendedCourse } from '../lib/recommendationEngine';
import { COMPETENCIES } from '../lib/competencyFramework';

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function TrainingRecommendationCard({ item, onStartLearning }: { item: RecommendedCourse; onStartLearning: () => void; }) {
  const { course, primaryGapAddressed, whyRecommended, matchPriority } = item;
  const priorityBadges = {
    'High Priority Match': 'bg-[hsl(13_70%_92%)] text-[hsl(13_58%_40%)] border-[hsl(13_70%_80%)]',
    'Role Alignment': 'bg-[hsl(42_72%_88%)] text-[hsl(30_48%_28%)] border-[hsl(42_72%_75%)]',
    'General Development': 'bg-secondary text-muted-foreground border-border',
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md space-y-4" data-testid={`course-card-${course.id}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-sidebar/10 px-2.5 py-1 text-[10px] font-bold text-sidebar uppercase tracking-wider">{course.provider}</span>
          <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">{course.source} (Demo Data)</span>
        </div>
        <span className={cx('inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[.08em]', priorityBadges[matchPriority])}>{matchPriority}</span>
      </div>
      <div><h3 className="font-serif text-xl font-bold text-foreground">{course.title}</h3><p className="mt-2 text-xs leading-5 text-muted-foreground">{course.description}</p></div>
      <div className="flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground bg-secondary/50 p-3 rounded-xl">
        <span className="flex items-center gap-1.5"><Clock size={14} className="text-primary" /><span>{course.duration}</span></span>
        <span className="flex items-center gap-1.5"><Award size={14} className="text-primary" /><span>{course.difficulty}</span></span>
        <span className="flex items-center gap-1.5"><BookOpen size={14} className="text-primary" /><span>{course.type}</span></span>
      </div>
      <div><span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Competencies Addressed:</span><div className="mt-1.5 flex flex-wrap gap-1.5">{course.competencies.map(cid => { const comp = COMPETENCIES.find(c => c.id === cid); const isPrimaryGap = primaryGapAddressed?.competencyId === cid; return <span key={cid} className={cx('rounded-lg px-2.5 py-1 text-[11px] font-semibold border', isPrimaryGap ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-background text-foreground')}>{comp?.name || cid}{isPrimaryGap && ` (-${primaryGapAddressed.gap}pt gap)`}</span>; })}</div></div>
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-1"><div className="flex items-center gap-1.5 text-xs font-bold text-primary"><Sparkles size={15} /><span>Why Recommended for Your MoSPI Profile</span></div><p className="text-xs leading-5 text-foreground/90">{whyRecommended}</p></div>
      <div className="pt-2 flex items-center justify-between border-t border-border/60"><span className="text-[11px] font-medium text-muted-foreground">Prerequisites: <strong>{course.prerequisites.join(', ')}</strong></span><button onClick={onStartLearning} data-testid={`button-start-course-${course.id}`} className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:brightness-110 active:translate-y-px"><span>Start Learning</span><ArrowRight size={14} /></button></div>
    </div>
  );
}