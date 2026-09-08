import { ArrowRight, CheckCircle2 } from 'lucide-react'; 
export function SystemFlowVisual() { 
  const steps = [ 
    'Learner Profile', 
    'Competency Mapping', 
    'Skill Gap Detection', 
    'Personalized Training', 
    'Adaptive Learning', 
    'Material Intelligence', 
    'AI Assessment', 
    'Competency Update', 
    'Adaptive Recommendation', 
    'Workforce Analytics', 
  ]; 
  return ( 
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4" data-testid="system-flow-visual"> 
      <div> 
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-primary">SIH26101 Architecture</p> 
        <h3 className="font-serif text-xl font-bold text-foreground">PathPilot Closed-Loop Intelligence</h3> 
        <p className="mt-1 text-xs text-muted-foreground"> 
          The learner's demonstrated evidence continuously changes the next learning decision. 
        </p> 
      </div> 
      <div className="flex flex-wrap items-center gap-2 pt-2"> 
        {steps.map((step, idx) => ( 
          <div key={step} className="flex items-center gap-2"> 
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-foreground"> 
              <span className="font-mono text-[10px] font-bold text-primary">{idx + 1}</span> 
              <span>{step}</span> 
            </span> 
            {idx < steps.length - 1 && <ArrowRight size={14} className="text-muted-foreground/60 shrink-0" />} 
          </div> 
        ))} 
      </div> 
    </div> 
  ); 
} 