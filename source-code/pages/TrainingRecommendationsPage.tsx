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
  const roleId = targetRole || 'stat_analyst';
  const roleOverview = calculateSkillGaps(roleId, demonstratedCompetencies);
  const recommendations = getTrainingRecommendations(roleId, demonstratedCompetencies, filter);
  const role = getRoleById(roleId);

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
            Courses matched dynamically to address your high-priority competency gaps for target role <strong className="text-foreground">{role?.title ?? roleOverview.role.title}</strong>.
          </p>
        </div>
        <button
          type="button"
          onClick={() => go('/competency')}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <ArrowRight size={16} />
          View Competency Profile
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Award size={17} />
            Competency Gaps
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">{roleOverview.gaps.length}</div>
          <p className="mt-1 text-xs text-muted-foreground">Identified for your target role</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Sparkles size={17} />
            Recommended Courses
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">{recommendations.length}</div>
          <p className="mt-1 text-xs text-muted-foreground">Matched to your competency profile</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <AlertCircle size={17} />
            High Priority
          </div>
          <div className="mt-2 text-3xl font-bold text-foreground">
            {roleOverview.gaps.filter((gap) => gap.priority === 'High').length}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Gaps needing immediate attention</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
          <Filter size={16} />
          Filter recommendations
        </div>
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cx(
                'rounded-full border px-3 py-2 text-xs font-semibold transition-colors',
                filter === tab.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-[-.02em] text-foreground">Recommended learning path</h2>
            <p className="mt-1 text-sm text-muted-foreground">Prioritized training mapped to the competency gaps identified for your role.</p>
          </div>
          <span className="hidden items-center gap-1 text-xs font-semibold text-muted-foreground sm:flex">
            <Info size={14} />
            {recommendations.length} result{recommendations.length === 1 ? '' : 's'}
          </span>
        </div>

        {recommendations.length > 0 ? (
          <div className="grid gap-4">
            {recommendations.map((item) => (
              <TrainingRecommendationCard
                key={item.course.id}
                item={item}
                onStartLearning={() => go('/learning')}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <BookOpen className="mx-auto text-muted-foreground" size={28} />
            <h3 className="mt-3 font-semibold text-foreground">No courses match this filter</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try another category to see the available training recommendations.</p>
          </div>
        )}
      </div>
    </div>
  );
}
