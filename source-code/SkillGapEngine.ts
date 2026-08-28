import { COMPETENCIES, DEMO_ROLES, getRoleById, type Competency, type RoleDefinition } from './competencyFramework';

export type PriorityLevel = 'High' | 'Medium' | 'Low' | 'Satisfied';
export type SkillGapAnalysis = { competencyId: string; competencyName: string; domain: string; currentLevel: number; requiredLevel: number; gap: number; priority: PriorityLevel; statusText: string; explanation: string; };
export type RoleGapOverview = { role: RoleDefinition; overallCompetencyMatch: number; gaps: SkillGapAnalysis[]; topPriorityGaps: SkillGapAnalysis[]; satisfiedCount: number; totalRequiredCount: number; };

export function calculateSkillGaps(targetRoleId: string, demonstratedCompetencies: Record<string, number>): RoleGapOverview {
  const role = getRoleById(targetRoleId);
  const requiredMap = role.requiredCompetencies;
  const gaps: SkillGapAnalysis[] = [];
  let totalRequiredSum = 0;
  let totalDemonstratedSum = 0;
  let satisfiedCount = 0;

  for (const [compId, requiredLevel] of Object.entries(requiredMap)) {
    const comp = COMPETENCIES.find(c => c.id === compId) ?? { id: compId, name: compId, domain: 'technical', description: '' };
    const currentLevel = Math.min(100, Math.max(0, demonstratedCompetencies[compId] ?? 35));
    const gap = Math.max(0, requiredLevel - currentLevel);
    totalRequiredSum += requiredLevel;
    totalDemonstratedSum += Math.min(currentLevel, requiredLevel);

    let priority: PriorityLevel = 'Satisfied';
    let statusText = 'Mastered';
    if (gap === 0) { satisfiedCount++; statusText = 'Role Requirement Met'; }
    else if (gap >= 25 || (gap >= 15 && requiredLevel >= 70)) { priority = 'High'; statusText = 'High Priority Gap'; }
    else if (gap >= 10) { priority = 'Medium'; statusText = 'Moderate Gap'; }
    else { priority = 'Low'; statusText = 'Minor Difference'; }

    const explanation = gap > 0
      ? `${comp.name} is currently at ${currentLevel}%, while the selected ${role.title} role requires ${requiredLevel}%. The resulting ${gap}-point gap makes ${comp.name} a ${priority.toLowerCase()}-priority competency area.`
      : `Your demonstrated mastery in ${comp.name} (${currentLevel}%) satisfies or exceeds the ${requiredLevel}% requirement for ${role.title}.`;

    gaps.push({ competencyId: compId, competencyName: comp.name, domain: comp.domain, currentLevel, requiredLevel, gap, priority, statusText, explanation });
  }

  const priorityWeight: Record<PriorityLevel, number> = { High: 4, Medium: 3, Low: 2, Satisfied: 1 };
  gaps.sort((a, b) => priorityWeight[b.priority] !== priorityWeight[a.priority] ? priorityWeight[b.priority] - priorityWeight[a.priority] : b.gap - a.gap);

  const overallCompetencyMatch = totalRequiredSum > 0 ? Math.round((totalDemonstratedSum / totalRequiredSum) * 100) : 100;
  const topPriorityGaps = gaps.filter(g => g.priority === 'High' || g.priority === 'Medium');

  return { role, overallCompetencyMatch, gaps, topPriorityGaps, satisfiedCount, totalRequiredCount: Object.keys(requiredMap).length };
}
