import { BrainCircuit, Check, Sparkles, Gauge, HelpCircle, RotateCcw, CheckCircle2, Route as RouteIcon } from 'lucide-react';
function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
export const loopSteps = [
  { label: 'Diagnostic', icon: BrainCircuit },
  { label: 'Personalization', icon: Sparkles },
  { label: 'Performance', icon: Gauge },
  { label: 'Knowledge Gap', icon: HelpCircle },
  { label: 'Prerequisite Repair', icon: RotateCcw },
  { label: 'Mastery Verification', icon: CheckCircle2 },
  { label: 'Adaptive Roadmap', icon: RouteIcon },
] as const;
export function loopStepForPath(path: string) {
  if (path === '/diagnostic') return 0;
  if (path === '/learning' || path === '/class' || path === '/notes') return 1;
  if (path === '/practice' || path === '/progress') return 2;
  if (path === '/gap') return 3;
  if (path === '/repair') return 4;
  if (path === '/verification' || path === '/return') return 5;
  return 6;
}
export function AdaptiveLoop({ current = 6, compact = false }: { current?: number; compact?: boolean }) {
  return (
    <div className={cx('adaptive-loop rounded-2xl border border-border bg-card', compact ? 'p-3' : 'p-4 sm:p-5')} data-testid="adaptive-loop">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-primary">The PathPilot 7-Stage Adaptive Loop</p>
          {!compact && <p className="mt-1 text-xs text-muted-foreground">The signal changes the route, not the destination.</p>}
        </div>
        {compact && <span className="hidden text-[10px] font-semibold text-muted-foreground sm:block">Current journey</span>}
      </div>
      <div className={cx('adaptive-loop-track mt-3', compact && 'mt-2')}>
        {loopSteps.map(({ label, icon: Icon }, index) => (
          <div key={label} className={cx('adaptive-loop-step', index === current && 'is-current', index < current && 'is-complete')} data-testid={`loop-step-${index}`}>
            <span className="adaptive-loop-dot">{index < current ? <Check size={12} /> : <Icon size={13} />}</span>
            <span className="adaptive-loop-label">{label}</span>
            {index < loopSteps.length - 1 && <span className="adaptive-loop-connector" />}
          </div>
        ))}
      </div>
    </div>
  );
}