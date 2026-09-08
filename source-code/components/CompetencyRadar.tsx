import type { SkillGapAnalysis } from '../lib/skillGapEngine';

export function CompetencyRadar({ gaps }: { gaps: SkillGapAnalysis[] }) {
  if (!gaps || gaps.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm" data-testid="competency-radar">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-primary">Demonstrated vs Required</p>
          <h3 className="font-serif text-xl font-bold">Competency Gap Overview</h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-primary" /><span>Demonstrated</span></div>
          <div className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-sm bg-secondary border border-border" /><span>Role Target</span></div>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {gaps.map(item => {
          const percentOfTarget = item.requiredLevel > 0 ? Math.min(100, Math.round((item.currentLevel / item.requiredLevel) * 100)) : 100;
          return (
            <div key={item.competencyId} className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                <span className="font-semibold text-foreground">{item.competencyName}</span>
                <span className="font-mono text-muted-foreground"><strong className={item.gap > 0 ? 'text-accent' : 'text-primary'}>{item.currentLevel}%</strong> / {item.requiredLevel}% {item.gap > 0 ? ` (${item.gap}% gap)` : ' (Satisfied)'}</span>
              </div>
              <div className="relative h-4 overflow-hidden rounded-md bg-secondary p-0.5">
                <div className="absolute bottom-0 top-0 z-20 w-0.5 bg-foreground/60" style={{ left: `${item.requiredLevel}%` }} />
                <div className="h-full rounded-sm bg-primary transition-all duration-500" style={{ width: `${item.currentLevel}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
