import { Users, Award, AlertTriangle, Clock, Gauge, Building2, ShieldCheck, Info } from 'lucide-react';
import { WorkforceAnalytics } from '../components/WorkforceAnalytics';
import { getWorkforceAnalyticsSummary } from '../lib/workforceAnalytics';

export function AdminDashboard({ go }: { go: (path: string) => void }) {
  const summary = getWorkforceAnalyticsSummary();
  return (
    <div className="mx-auto max-w-6xl space-y-8" data-testid="page-admin-dashboard">
      <div className="flex flex-col justify-between gap-5 rounded-[1.8rem] border border-border bg-card p-6 shadow-sm sm:p-8 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary"><Building2 size={14} /><span>Official Statistical System Intelligence</span></div>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-[-.03em] text-foreground sm:text-4xl">Workforce Competency & Analytics Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Aggregate competency signals, organizational skill gaps, and training effectiveness analytics for MoSPI administrative leadership.</p>
        </div>
        <div className="shrink-0 rounded-2xl border border-accent/30 bg-accent/10 p-4 text-xs font-bold text-accent"><span>Demo Workforce Data</span><p className="mt-1 font-normal text-[11px] text-muted-foreground">Not real employee personal records</p></div>
      </div>
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/70 p-4 text-xs leading-5 text-muted-foreground"><Info size={18} className="shrink-0 text-primary" /><span><strong>Prototype Analytics Layer:</strong> Calculates organization-wide competency averages, identifies top skill deficits, and generates actionable upskilling recommendations.</span></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center justify-between text-muted-foreground"><span className="text-xs font-semibold">Total Workforce</span><Users size={18} className="text-primary" /></div><p className="mt-3 font-serif text-3xl font-bold text-foreground">{summary.totalLearners}</p><p className="mt-1 text-[11px] text-muted-foreground">Active MoSPI Officers</p></div>
        <div className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center justify-between text-muted-foreground"><span className="text-xs font-semibold">Avg Competency Match</span><Award size={18} className="text-primary" /></div><p className="mt-3 font-serif text-3xl font-bold text-foreground">{summary.avgCompetencyMatch}%</p><p className="mt-1 text-[11px] text-muted-foreground">Role Requirement Baseline</p></div>
        <div className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center justify-between text-muted-foreground"><span className="text-xs font-semibold">Active Priority Gaps</span><AlertTriangle size={18} className="text-accent" /></div><p className="mt-3 font-serif text-3xl font-bold text-accent">{summary.activeHighPriorityGapsCount}</p><p className="mt-1 text-[11px] text-accent font-semibold">High Priority Deficits</p></div>
        <div className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center justify-between text-muted-foreground"><span className="text-xs font-semibold">Avg Learning Hours</span><Clock size={18} className="text-primary" /></div><p className="mt-3 font-serif text-3xl font-bold text-foreground">{summary.avgLearningHours}h</p><p className="mt-1 text-[11px] text-muted-foreground">Per Officer Completed</p></div>
        <div className="rounded-2xl border border-border bg-card p-5"><div className="flex items-center justify-between text-muted-foreground"><span className="text-xs font-semibold">Avg Assessment Score</span><Gauge size={18} className="text-[hsl(162_46%_27%)]" /></div><p className="mt-3 font-serif text-3xl font-bold text-[hsl(162_46%_27%)]">{summary.avgAssessmentScore}%</p><p className="mt-1 text-[11px] text-muted-foreground">Competency Quiz Average</p></div>
      </div>
      <WorkforceAnalytics go={go} />
      <div className="rounded-2xl border border-border bg-card p-6 space-y-2"><div className="flex items-center gap-2 text-xs font-bold text-primary"><ShieldCheck size={16} /><span>Production Architecture — Planned Government Security</span></div><p className="text-xs leading-5 text-muted-foreground">In production deployment, PathPilot connects to official government SSO (ePramaan), enforces role-based access control (RBAC), operates on CERT-In certified MeghRaj cloud infrastructure, and maintains end-to-end audit logging for statistical data privacy compliance.</p></div>
    </div>
  );
}
