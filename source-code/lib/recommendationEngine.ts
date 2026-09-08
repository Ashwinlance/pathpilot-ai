import { DEMO_TRAINING_COURSES, type TrainingCourse } from './trainingRepository';
import { calculateSkillGaps, type SkillGapAnalysis } from './skillGapEngine';
import { getRoleById } from './competencyFramework';

export type RecommendedCourse = {
  course: TrainingCourse;
  relevanceScore: number;
  primaryGapAddressed: SkillGapAnalysis | null;
  whyRecommended: string;
  matchPriority: 'High Priority Match' | 'Role Alignment' | 'General Development';
};

export function getTrainingRecommendations(targetRoleId: string, demonstratedCompetencies: Record<string, number>, filterCategory: string = 'all'): RecommendedCourse[] {
  const roleOverview = calculateSkillGaps(targetRoleId, demonstratedCompetencies);
  const gapsMap = new Map<string, SkillGapAnalysis>();
  roleOverview.gaps.forEach(g => gapsMap.set(g.competencyId, g));
  const role = getRoleById(targetRoleId);
  let courses = [...DEMO_TRAINING_COURSES];
  if (filterCategory === 'igot') courses = courses.filter(c => c.source.includes('iGOT'));
  else if (filterCategory === 'nssta') courses = courses.filter(c => c.source.includes('NSSTA'));
  else if (filterCategory === 'high_priority') courses = courses.filter(c => c.competencies.some(cid => gapsMap.get(cid)?.priority === 'High'));
  else if (filterCategory === 'statistical') courses = courses.filter(c => c.competencies.some(cid => cid.startsWith('stat_')));
  else if (filterCategory === 'technical') courses = courses.filter(c => c.competencies.some(cid => cid.startsWith('tech_')));
  else if (filterCategory === 'governance') courses = courses.filter(c => c.competencies.some(cid => cid.startsWith('gov_')));
  else if (filterCategory === 'managerial') courses = courses.filter(c => c.competencies.some(cid => cid.startsWith('mgt_')));
  const recommendations: RecommendedCourse[] = courses.map(course => {
    let score = 0;
    let primaryGap: SkillGapAnalysis | null = null;
    let maxGapValue = -1;
    for (const compId of course.competencies) {
      const gapAnalysis = gapsMap.get(compId);
      if (gapAnalysis) {
        if (gapAnalysis.priority === 'High') score += 50 + gapAnalysis.gap;
        else if (gapAnalysis.priority === 'Medium') score += 30 + gapAnalysis.gap;
        else if (gapAnalysis.priority === 'Low') score += 15 + gapAnalysis.gap;
        else score += 5;
        if (gapAnalysis.gap > maxGapValue) { maxGapValue = gapAnalysis.gap; primaryGap = gapAnalysis; }
      }
    }
    if (course.targetRoles.includes(targetRoleId)) score += 20;
    let whyRecommended = '';
    let matchPriority: RecommendedCourse['matchPriority'] = 'General Development';
    if (primaryGap && primaryGap.gap > 0) {
      whyRecommended = `${primaryGap.competencyName} is currently at ${primaryGap.currentLevel}%, while your selected ${role.title} role requires ${primaryGap.requiredLevel}% (${primaryGap.gap}-point ${primaryGap.priority.toLowerCase()} priority gap). This course directly addresses your ${primaryGap.competencyName} competency.`;
      matchPriority = primaryGap.priority === 'High' ? 'High Priority Match' : 'Role Alignment';
    } else if (course.targetRoles.includes(targetRoleId)) {
      whyRecommended = `Aligned with the baseline competencies required for ${role.title} in India's Official Statistical System.`;
      matchPriority = 'Role Alignment';
    } else {
      whyRecommended = `Enhances statistical data skills and supports career progression within MoSPI.`;
    }
    return { course, relevanceScore: score, primaryGapAddressed: primaryGap, whyRecommended, matchPriority };
  });
  recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return recommendations;
}