import { Award, Gauge, BookOpen, Clock, CheckCircle2, TrendingUp } from 'lucide-react'; 
import { CompetencyRadar } from '../components/CompetencyRadar'; 
import { TechnicalTransparency } from '../components/TechnicalTransparency'; 
import { SystemFlowVisual } from '../components/SystemFlowVisual'; 
import { calculateSkillGaps } from '../lib/skillGapEngine'; 
export function ProgressPage({ 
  profile, 
  demonstratedCompetencies, 
  topics, 
  go, 
}: { 
  profile: { name?: string; targetRole?: string }; 
  demonstratedCompetencies: Record<string, number>; 
  topics: { mastery: number; status: string; title: string }[]; 
  go: (path: string) => void; 
}) { 
  const roleOverview = calculateSkillGaps(profile.targetRole || 'stat_analyst', demonstratedCompetencies); 
  const overallSignal = Math.round(topics.reduce((sum, t) => sum + t.mastery, 0) / topics.length); 
  const masteredCount = topics.filter(t => t.status === 'mastered').length; 
  return ( 
    <div className="mx-auto max-w-6xl space-y-8" data-testid="page-progress"> 
      {/* Header */} 
      <div className="flex flex-col justify-between gap-4 rounded-[1.8rem] border border-border bg-card p-6 shadow-sm sm:p-8"> 
        <div> 
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary"> 
            <Gauge size={14} /> 
            <span>Learner Competency & Mastery Analytics</span> 
          </div> 
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-[-.03em] text-foreground sm:text-4xl"> 
            Progress & Mastery Signal Dashboard 
          </h1> 
          <p className="mt-2 text-sm leading-6 text-muted-foreground"> 
            Track demonstrated competency improvements, completed landmarks, skill gap priority rankings, and system evidence. 
          </p> 
        </div> 
      </div> 
      {/* KPI Stats */} 
      <div className="grid gap-4 sm:grid-cols-4"> 
        <div className="rounded-2xl border border-border bg-card p-5"> 
          <span className="text-xs font-semibold text-muted-foreground">Overall Route Signal</span> 
          <p className="mt-2 font-serif text-3xl font-bold text-primary">{overallSignal}%</p> 
          <p className="mt-1 text-xs text-muted-foreground">Python Landmark Average</p> 
        </div> 
        <div className="rounded-2xl border border-border bg-card p-5"> 
          <span className="text-xs font-semibold text-muted-foreground">Target Role Competency Match</span> 
          <p className="mt-2 font-serif text-3xl font-bold text-foreground">{roleOverview.overallCompetencyMatch}%</p> 
          <p className="mt-1 text-xs text-muted-foreground">{roleOverview.role.title}</p> 
        </div> 
        <div className="rounded-2xl border border-border bg-card p-5"> 
          <span className="text-xs font-semibold text-muted-foreground">Landmarks Mastered</span> 
          <p className="mt-2 font-serif text-3xl font-bold text-[hsl(162_46%_27%)]">{masteredCount} / {topics.length}</p> 
          <p className="mt-1 text-xs text-muted-foreground">Core Landmarks Verified</p> 
        </div> 
        <div className="rounded-2xl border border-border bg-card p-5"> 
          <span className="text-xs font-semibold text-muted-foreground">Satisfied Competencies</span> 
          <p className="mt-2 font-serif text-3xl font-bold text-foreground">{roleOverview.satisfiedCount} / {roleOverview.totalRequiredCount}</p> 
          <p className="mt-1 text-xs text-muted-foreground">Role Requirements Met</p> 
        </div> 
      </div> 
      {/* System Flow Diagram */} 
      <SystemFlowVisual /> 
      {/* Competency Radar Comparison Chart */} 
      <CompetencyRadar gaps={roleOverview.gaps} /> 
      {/* Technical Transparency */} 
      <TechnicalTransparency /> 
    </div> 
  ); 
} 
