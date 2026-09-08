import { DOMAINS, type DomainId } from '../lib/competencyFramework';
import type { SkillGapAnalysis } from '../lib/skillGapEngine';

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function CompetencyCard({ item }: { item: SkillGapAnalysis }) {
  const domainInfo = DOMAINS[item.domain as DomainId] ?? { name: item.domain, color: 'hsl(172 47% 22%)' };
  const priorityStyles = {
    High: 'bg-[hsl(13_70%_92%)] text-[hsl(13_58%_40%)] border-[hsl(13_70%_80%)]',
    Medium: 'bg-[hsl(42_72%_88%)] text-[hsl(30_48%_28%)] border-[hsl(42_72%_75%)]',
    Low: 'bg-[hsl(197_45%_90%)] text-[hsl(197_45%_25%)] border-[hsl(197_45%_80%)]',
    Satisfied: 'bg-[hsl(155_32%_88%)] text-[hsl(162_46%_27%)] border-[hsl(155_32%_78%)]',
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md" data-testid={`competency-card-${item.competencyId}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[.14em] text-muted-foreground">{domainInfo.name}</span>
          <h3 className="mt-1 font-serif text-lg font-bold text-foreground">{item.competencyName}</h3>
        </div>
        <span className={cx('inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.08em]', priorityStyles[item.priority])}>
          {item.priority === 'Satisfied' ? 'Satisfied' : `${item.priority} Priority`}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-muted-foreground">Current Demonstrated: <strong className="text-foreground">{item.currentLevel}%</strong></span>
          <span className="text-muted-foreground">Required: <strong className="text-foreground">{item.requiredLevel}%</strong></span>
        </div>
        <div className="relative h-2.5 overflow-hidden rounded-full bg-secondary">
          <div className="absolute top-0 bottom-0 z-10 w-1 bg-foreground/40" style={{ left: `${item.requiredLevel}%` }} title={`Required: ${item.requiredLevel}%`} />
          <div
            className={cx('h-full rounded-full transition-all duration-500', item.priority === 'High' && 'bg-accent', item.priority === 'Medium' && 'bg-[hsl(42_72%_55%)]', item.priority === 'Low' && 'bg-[hsl(197_45%_45%)]', item.priority === 'Satisfied' && 'bg-primary')}
            style={{ width: `${item.currentLevel}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
        {item.gap > 0 ? <span className="font-semibold text-accent">Competency Gap: <strong>{item.gap} points</strong></span> : <span className="font-semibold text-[hsl(162_46%_27%)]">✓ Target Achieved ({item.currentLevel}%)</span>}
        <span className="text-[11px] text-muted-foreground">{item.statusText}</span>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground/90">{item.explanation}</p>
    </div>
  );
}
