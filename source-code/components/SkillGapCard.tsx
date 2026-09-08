import { ArrowRight, AlertTriangle } from 'lucide-react';
import type { SkillGapAnalysis } from '../lib/skillGapEngine';

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function SkillGapCard({ gap, onNavigate }: { gap: SkillGapAnalysis; onNavigate?: () => void }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md" data-testid={`skill-gap-card-${gap.competencyId}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={cx('grid h-9 w-9 place-items-center rounded-xl text-xs font-bold', gap.priority === 'High' ? 'bg-[hsl(13_70%_90%)] text-[hsl(13_58%_40%)]' : 'bg-[hsl(42_72%_85%)] text-[hsl(30_48%_28%)]')}><AlertTriangle size={18} /></span>
          <div><h4 className="font-serif font-bold text-foreground">{gap.competencyName}</h4><span className="text-[11px] font-semibold text-muted-foreground">{gap.priority} Priority Gap</span></div>
        </div>
        <span className="rounded-full bg-accent/15 px-3 py-1 font-mono text-xs font-bold text-accent">-{gap.gap} points</span>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary/60 p-3 text-xs">
        <div><span className="block text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Current</span><span className="font-mono text-sm font-bold text-foreground">{gap.currentLevel}%</span></div>
        <div className="text-center font-bold text-muted-foreground">vs</div>
        <div className="text-right"><span className="block text-muted-foreground text-[10px] uppercase font-bold tracking-wider">Required</span><span className="font-mono text-sm font-bold text-primary">{gap.requiredLevel}%</span></div>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">{gap.explanation}</p>
      {onNavigate && <button onClick={onNavigate} data-testid={`button-view-path-${gap.competencyId}`} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 py-2.5 text-xs font-bold text-primary transition hover:bg-primary hover:text-primary-foreground"><span>View Learning Path</span><ArrowRight size={14} /></button>}
    </div>
  );
}
