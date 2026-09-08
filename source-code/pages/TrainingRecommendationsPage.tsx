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
