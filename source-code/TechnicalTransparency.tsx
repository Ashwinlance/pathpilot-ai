import { ShieldCheck, CheckCircle2, AlertCircle, Clock } from 'lucide-react'; 
export function TechnicalTransparency() { 
  return ( 
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6" data-testid="technical-transparency"> 
      <div className="flex items-center justify-between border-b border-border pb-4"> 
        <div> 
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary"> 
            <ShieldCheck size={14} /> 
            <span>Technical Integrity & Transparency</span> 
          </div> 
          <h3 className="mt-2 font-serif text-xl font-bold">SIH26101 Architecture Status</h3> 
        </div> 
        <span className="text-xs text-muted-foreground font-semibold">Official Hackathon System Declaration</span> 
      </div> 
      <div className="grid gap-5 sm:grid-cols-3 text-xs"> 
        {/* Implemented Now */} 
        <div className="rounded-xl border border-[hsl(162_46%_75%)] bg-[hsl(155_32%_94%)] p-4 space-y-3"> 
          <div className="flex items-center gap-2 text-sm font-bold text-[hsl(162_46%_25%)]"> 
            <CheckCircle2 size={16} /> 
            <span>IMPLEMENTED NOW</span> 
          </div> 
          <ul className="space-y-1.5 leading-5 text-[hsl(162_46%_25%)]/90"> 
            <li>• React 18 & TypeScript Engine</li> 
            <li>• Wouter Client-side Router</li> 
            <li>• Centralized Single Learner State</li> 
            <li>• LocalStorage Persistence & Migration</li> 
            <li>• 7-Stage Adaptive Learning Loop</li> 
            <li>• MoSPI 4-Domain Competency Engine</li> 
            <li>• Deterministic Skill-Gap Engine</li> 
            <li>• iGOT/NSSTA Recommendation Engine</li> 
            <li>• Competency-Aware Assessment Engine</li> 
            <li>• Contextual AI Learning Copilot</li> 
            <li>• Role-based Learner & Admin UI</li> 
          </ul> 
        </div> 
        {/* Simulated / Demo */} 
        <div className="rounded-xl border border-[hsl(42_72%_75%)] bg-[hsl(42_72%_92%)] p-4 space-y-3"> 
          <div className="flex items-center gap-2 text-sm font-bold text-[hsl(30_48%_28%)]"> 
            <AlertCircle size={16} /> 
            <span>SIMULATED / DEMO</span> 
          </div> 
          <ul className="space-y-1.5 leading-5 text-[hsl(30_48%_28%)]/90"> 
            <li>• iGOT Karmayogi Course Repository</li> 
            <li>• NSSTA / TPAC Course Repository</li> 
            <li>• MoSPI Workforce Officer Records</li> 
            <li>• Sample Document Concept Ingestion</li> 
            <li>• Demo Assessment Question Generator</li> 
          </ul> 
        </div> 
        {/* Planned Production Integration */} 
        <div className="rounded-xl border border-border bg-secondary/70 p-4 space-y-3"> 
          <div className="flex items-center gap-2 text-sm font-bold text-foreground"> 
            <Clock size={16} className="text-primary" /> 
            <span>PLANNED PRODUCTION</span> 
          </div> 
          <ul className="space-y-1.5 leading-5 text-muted-foreground"> 
            <li>• Official iGOT Karmayogi REST APIs</li> 
            <li>• Government ePramaan SSO Auth</li> 
            <li>• MeghRaj NIC Cloud Backend</li> 
            <li>• PostgreSQL Production DB</li> 
            <li>• Production LLM / AI Microservice</li> 
            <li>• CERT-In Security Controls</li> 
          </ul> 
        </div> 
      </div> 
    </div> 
  ); 
} 