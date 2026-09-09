import { useState } from 'react';
import { BookOpen, Sparkles, Filter, Award, AlertCircle, ArrowRight, Info } from 'lucide-react';
import { getTrainingRecommendations } from '../lib/recommendationEngine';
import { calculateSkillGaps } from '../lib/skillGapEngine';
import { getRoleById } from '../lib/competencyFramework';
import { TrainingRecommendationCard } from '../components/TrainingRecommendationCard';

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function TrainingRecommendationsPage({
  targetRole,
  demonstratedCompetencies,
  go,
}: {
  targetRole: string;
  demonstratedCompetencies: Record<string, number>;
  go: (path: string) => void;
}) {
  const [filter, setFilter] = useState<string>('all');

  const roleOverview = calculateSkillGaps(targetRole || 'stat_analyst', demonstratedCompetencies);
  const recommendations = getTrainingRecommendations(targetRole || 'stat_analyst', demonstratedCompetencies, filter);

  const filterTabs = [
    { id: 'all', label: 'All Courses' },
    { id: 'high_priority', label: 'High Priority Gaps' },
    { id: 'igot', label: 'iGOT Karmayogi' },
    { id: 'nssta', label: 'NSSTA / TPAC' },
    { id: 'statistical', label: 'Statistical System' },
    { id: 'technical', label: 'Technical & Data' },
    { id: 'governance', label: 'Digital Governance' },
    { id: 'managerial', label: 'Managerial' },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8" data-testid="page-training-recommendations">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-5 rounded-[1.8rem] border border-border bg-card p-6 shadow-sm sm:p-8 md:flex-row md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <BookOpen size={14} />
            <span>iGOT Karmayogi & NSSTA Integration</span>
          </div>
          <h1 className="mt-3 font-serif text-3xl font-bold tracking-[-.03em] text-foreground sm:text-4xl">
            Personalized Training Recommendations
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Courses matched dynamically to address your high-priority competency gaps for target role <strong className="text-foreground">{roleOverview.role.title}</strong>.
          </p>
        </div>

        <div className="shrink-0 rounded-2xl border border-border bg-secondary/50 p-4 text-xs font-semibold text-muted-foreground">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-primary">Target Role Baseline</span>
          <span className="font-serif text-base font-bold text-foreground">{roleOverview.role.title}</span>
          <p className="mt-1 text-[11px]">{roleOverview.overallCompetencyMatch}% Role Competency Match</p>
        </div>
      </div>

      {/* Demo Technical Honesty Notice */}
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/70 p-4 text-xs leading-5 text-muted-foreground">
        <Info size={18} className="shrink-0 text-primary" />
        <span>
          <strong>Prototype Demo Repository:</strong> Course catalogs are modeled after official iGOT Karmayogi and NSSTA frameworks. The recommendation logic dynamically evaluates actual competency gap signals.
        </span>
      </div>

      {/* Top Priority Skill Gaps Summary Header */}
      {roleOverview.topPriorityGaps.length > 0 && (
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-accent">
            <AlertCircle size={18} />
            <span>Addressing Your Top Priority Skill Gaps</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {roleOverview.topPriorityGaps.map(gap => (
              <span key={gap.competencyId} className="inline-flex items-center gap-1.5 rounded-xl border border-accent/30 bg-card px-3 py-1.5 text-xs font-semibold text-foreground">
                <span className="font-bold text-accent">-{gap.gap}pt gap</span>
                <span>{gap.competencyName} ({gap.priority} Priority)</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs & Recommendations Grid */}
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-2xl font-bold">Recommended Training Courses</h2>
            <p className="mt-1 text-xs text-muted-foreground">Ranked by relevance score, gap priority, and target role alignment.</p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-1.5 rounded-xl border border-border bg-card p-1">
            {filterTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={cx(
                  'rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                  filter === tab.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations List */}
        <div className="grid gap-6 sm:grid-cols-2">
          {recommendations.map(rec => (
            <TrainingRecommendationCard key={rec.course.id} item={rec} onStartLearning={() => go('/roadmap')} />
          ))}
        </div>
      </div>
    </div>
  );
}
