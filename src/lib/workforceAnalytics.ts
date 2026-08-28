import { COMPETENCIES } from './competencyFramework';
import { calculateSkillGaps } from './skillGapEngine';

export type DemoLearner = {
  id: string;
  name: string;
  designation: string;
  department: string;
  currentRole: string;
  targetRole: string;
  competencies: Record<string, number>;
  trainingCompleted: string[];
  learningHours: number;
  assessmentScores: number[];
};

export type DepartmentMetric = {
  department: string;
  learnerCount: number;
  avgCompetencyMatch: number;
  avgLearningHours: number;
  topGapCompetency: string;
  topGapPoints: number;
  avgAssessmentScore: number;
};

export type AdminRecommendation = {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
  targetCompetencyId: string;
  affectedLearnersCount: number;
};

export const DEMO_WORKFORCE_LEARNERS: DemoLearner[] = [
  { id: 'usr_1', name: 'Dr. Rajesh Sharma', designation: 'Senior Statistical Officer', department: 'National Accounts Division (NAD)', currentRole: 'stat_officer', targetRole: 'stat_analyst', competencies: { tech_python: 45, tech_sql: 38, stat_survey_design: 75, stat_national_accounts: 70, stat_data_quality: 75, tech_datavis: 60, gov_privacy: 65, mgt_ethics: 80 }, trainingCompleted: ['NSSTA Basic Sampling', 'iGOT Data Privacy'], learningHours: 24, assessmentScores: [75, 80, 70] },
  { id: 'usr_2', name: 'Priya Sundaram', designation: 'Data Analyst', department: 'Data Informatics & Innovation Division (DIID)', currentRole: 'data_analyst', targetRole: 'dir_datascience', competencies: { tech_python: 75, tech_sql: 65, tech_datavis: 70, tech_api: 60, tech_aiml: 45, tech_cloud: 40, gov_dpi: 55, mgt_proj_mgt: 60 }, trainingCompleted: ['Python for Data Science', 'iGOT Datavis'], learningHours: 36, assessmentScores: [85, 90, 80] },
  { id: 'usr_3', name: 'Amitabh Verma', designation: 'Joint Director', department: 'Economic Statistics Division (ESD)', currentRole: 'research_officer', targetRole: 'dir_datascience', competencies: { stat_national_accounts: 80, stat_price_stats: 75, stat_sdg: 70, tech_r: 65, tech_python: 50, tech_aiml: 35, gov_cybersec: 50, mgt_leadership: 85 }, trainingCompleted: ['NSSTA Macroeconomics', 'Public Leadership'], learningHours: 18, assessmentScores: [65, 70] },
  { id: 'usr_4', name: 'Sunita Meena', designation: 'Statistical Officer', department: 'Survey Design & Research Division (SDRD)', currentRole: 'stat_officer', targetRole: 'stat_officer', competencies: { stat_survey_design: 80, stat_sampling: 75, stat_data_quality: 80, tech_python: 35, tech_sql: 40, mgt_proj_mgt: 70, gov_privacy: 60 }, trainingCompleted: ['NSSTA Sampling 201'], learningHours: 28, assessmentScores: [75, 75] },
  { id: 'usr_5', name: 'Vikram Joshi', designation: 'Assistant Director', department: 'Social Statistics Division (SSD)', currentRole: 'stat_analyst', targetRole: 'stat_analyst', competencies: { tech_python: 60, tech_sql: 55, stat_survey_design: 60, stat_national_accounts: 50, stat_data_quality: 65, tech_datavis: 55, gov_privacy: 55 }, trainingCompleted: ['iGOT SQL 101'], learningHours: 16, assessmentScores: [80] },
  { id: 'usr_6', name: 'Kavita Nair', designation: 'Senior Statistical Officer', department: 'Field Operations Division (FOD)', currentRole: 'stat_officer', targetRole: 'stat_officer', competencies: { stat_survey_design: 85, stat_sampling: 80, stat_data_quality: 85, tech_python: 40, tech_sql: 35, tech_gis: 45, mgt_proj_mgt: 75 }, trainingCompleted: ['NSSTA Survey Field Ops'], learningHours: 22, assessmentScores: [70, 75] },
  { id: 'usr_7', name: 'Manoj Kumar', designation: 'Data Analyst', department: 'Data Informatics & Innovation Division (DIID)', currentRole: 'data_analyst', targetRole: 'data_analyst', competencies: { tech_python: 80, tech_sql: 75, tech_datavis: 75, tech_api: 70, tech_aiml: 50, gov_privacy: 60 }, trainingCompleted: ['Python Stats', 'Datavis Dashboards'], learningHours: 42, assessmentScores: [90, 85, 95] },
  { id: 'usr_8', name: 'Ananya Roy', designation: 'Research Officer', department: 'Economic Statistics Division (ESD)', currentRole: 'research_officer', targetRole: 'research_officer', competencies: { stat_national_accounts: 85, stat_price_stats: 80, stat_sdg: 75, tech_r: 70, tech_stata: 65, tech_python: 55, mgt_decision: 80 }, trainingCompleted: ['SNA 2008 GDP Workshop', 'R Econometrics'], learningHours: 30, assessmentScores: [85, 80] },
  { id: 'usr_9', name: 'Rohan Gupta', designation: 'Statistical Officer', department: 'National Accounts Division (NAD)', currentRole: 'stat_analyst', targetRole: 'stat_analyst', competencies: { tech_python: 50, tech_sql: 40, stat_survey_design: 60, stat_national_accounts: 65, stat_data_quality: 70, tech_datavis: 50 }, trainingCompleted: ['iGOT SQL 101'], learningHours: 14, assessmentScores: [60, 70] },
  { id: 'usr_10', name: 'Deepak Patel', designation: 'Deputy Director', department: 'Data Informatics & Innovation Division (DIID)', currentRole: 'dir_datascience', targetRole: 'dir_datascience', competencies: { tech_aiml: 65, tech_cloud: 60, tech_python: 70, gov_dpi: 70, gov_cybersec: 65, gov_privacy: 75, mgt_leadership: 80 }, trainingCompleted: ['AI & NLP Official Data', 'MeghRaj Cloud Standards'], learningHours: 38, assessmentScores: [85, 90] },
];

export function getWorkforceAnalyticsSummary() {
  const learners = DEMO_WORKFORCE_LEARNERS;
  const totalLearners = learners.length;
  const domainTotals: Record<string, { demonstrated: number; count: number }> = {
    statistical: { demonstrated: 0, count: 0 }, technical: { demonstrated: 0, count: 0 }, governance: { demonstrated: 0, count: 0 }, managerial: { demonstrated: 0, count: 0 },
  };
  const compTotals: Record<string, { currentSum: number; reqSum: number; count: number }> = {};
  let totalMatchSum = 0, totalLearningHours = 0, totalAssessmentScoreSum = 0, totalAssessmentCount = 0;

  learners.forEach(learner => {
    totalLearningHours += learner.learningHours;
    learner.assessmentScores.forEach(sc => { totalAssessmentScoreSum += sc; totalAssessmentCount++; });
    const gapOverview = calculateSkillGaps(learner.targetRole, learner.competencies);
    totalMatchSum += gapOverview.overallCompetencyMatch;
    for (const gap of gapOverview.gaps) {
      const cid = gap.competencyId;
      if (!compTotals[cid]) compTotals[cid] = { currentSum: 0, reqSum: 0, count: 0 };
      compTotals[cid].currentSum += gap.currentLevel;
      compTotals[cid].reqSum += gap.requiredLevel;
      compTotals[cid].count += 1;
      if (domainTotals[gap.domain]) {
        domainTotals[gap.domain].demonstrated += gap.currentLevel;
        domainTotals[gap.domain].count += 1;
      }
    }
  });

  const avgCompetencyMatch = Math.round(totalMatchSum / totalLearners);
  const avgLearningHours = Math.round(totalLearningHours / totalLearners);
  const avgAssessmentScore = totalAssessmentCount > 0 ? Math.round(totalAssessmentScoreSum / totalAssessmentCount) : 0;

  const orgGaps = Object.entries(compTotals).map(([cid, data]) => {
    const comp = COMPETENCIES.find(c => c.id === cid) ?? { name: cid, domain: 'technical' };
    const avgCurrent = Math.round(data.currentSum / data.count);
    const avgRequired = Math.round(data.reqSum / data.count);
    const gap = Math.max(0, avgRequired - avgCurrent);
    let priority: 'High' | 'Medium' | 'Low' = 'Low';
    if (gap >= 25 || (gap >= 15 && avgRequired >= 70)) priority = 'High';
    else if (gap >= 10) priority = 'Medium';
    return { competencyId: cid, competencyName: comp.name, domain: comp.domain, avgCurrent, avgRequired, gap, priority, affectedLearnersCount: learners.filter(l => (l.competencies[cid] ?? 35) < avgRequired).length };
  });

  orgGaps.sort((a, b) => b.gap - a.gap);
  const topOrgSkillGaps = orgGaps.filter(g => g.gap > 0).slice(0, 5);

  const deptMap: Record<string, DemoLearner[]> = {};
  learners.forEach(l => { if (!deptMap[l.department]) deptMap[l.department] = []; deptMap[l.department].push(l); });

  const departmentMetrics: DepartmentMetric[] = Object.entries(deptMap).map(([dept, dLearners]) => {
    let dMatchSum = 0, dHoursSum = 0, dScoreSum = 0, dScoreCount = 0;
    dLearners.forEach(l => {
      const gOverview = calculateSkillGaps(l.targetRole, l.competencies);
      dMatchSum += gOverview.overallCompetencyMatch;
      dHoursSum += l.learningHours;
      l.assessmentScores.forEach(s => { dScoreSum += s; dScoreCount++; });
    });
    const topGapForDept = topOrgSkillGaps[0];
    return {
      department: dept,
      learnerCount: dLearners.length,
      avgCompetencyMatch: Math.round(dMatchSum / dLearners.length),
      avgLearningHours: Math.round(dHoursSum / dLearners.length),
      topGapCompetency: topGapForDept?.competencyName || 'SQL & Databases',
      topGapPoints: topGapForDept?.gap || 21,
      avgAssessmentScore: dScoreCount > 0 ? Math.round(dScoreSum / dScoreCount) : 75,
    };
  });

  const topGap = topOrgSkillGaps[0];
  const secGap = topOrgSkillGaps[1];
  const adminRecommendations: AdminRecommendation[] = [
    { id: 'rec_1', title: `Deploy TargetUpskilling Program for ${topGap?.competencyName || 'AI & Machine Learning'}`, description: `High-priority organization-wide gap of ${topGap?.gap || 27} points identified. Recommend initiating a targeted iGOT e-learning cohort for affected officers.`, priority: 'High', reason: `${topGap?.affectedLearnersCount || 9} learners currently fall below the required baseline of ${topGap?.avgRequired || 75}% in ${topGap?.competencyName || 'AI/ML'}.`, targetCompetencyId: topGap?.competencyId || 'tech_aiml', affectedLearnersCount: topGap?.affectedLearnersCount || 9 },
    { id: 'rec_2', title: `Schedule NSSTA Hands-on Workshop for ${secGap?.competencyName || 'SQL Database Querying'}`, description: `Skill-gap analysis shows a ${secGap?.gap || 21}-point average deficit in SQL query compilation across National Accounts & SDRD divisions.`, priority: 'High', reason: 'Directly impacts GDP quarterly estimation accuracy and automated micro-data compilation schedules.', targetCompetencyId: secGap?.competencyId || 'tech_sql', affectedLearnersCount: secGap?.affectedLearnersCount || 8 },
    { id: 'rec_3', title: 'Promote Data Privacy & DPDP Act Certification', description: 'Mandate the 4-hour iGOT Data Privacy compliance module for all Senior Statistical Officers prior to annual statistical releases.', priority: 'Medium', reason: 'Aligns Official Statistical System publishing standards with national DPDP Act guidelines.', targetCompetencyId: 'gov_privacy', affectedLearnersCount: 6 },
  ];

  return {
    totalLearners,
    avgCompetencyMatch,
    avgLearningHours,
    avgAssessmentScore,
    activeHighPriorityGapsCount: topOrgSkillGaps.filter(g => g.priority === 'High').length,
    domainAverages: {
      statistical: domainTotals.statistical.count > 0 ? Math.round(domainTotals.statistical.demonstrated / domainTotals.statistical.count) : 70,
      technical: domainTotals.technical.count > 0 ? Math.round(domainTotals.technical.demonstrated / domainTotals.technical.count) : 58,
      governance: domainTotals.governance.count > 0 ? Math.round(domainTotals.governance.demonstrated / domainTotals.governance.count) : 64,
      managerial: domainTotals.managerial.count > 0 ? Math.round(domainTotals.managerial.demonstrated / domainTotals.managerial.count) : 75,
    },
    topOrgSkillGaps,
    departmentMetrics,
    adminRecommendations,
  };
}
