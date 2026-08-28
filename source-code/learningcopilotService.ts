export type CopilotAction = 'explain' | 'hint' | 'example' | 'practice' | 'repair' | 'next' | 'explain_gap' | 'why_recommended' | 'mistake' | 'admin_top_gap' | 'admin_dept' | 'admin_rec';

export type LearningCopilotContext = {
  currentTopic: string;
  learnerLevel: string;
  topicMastery: number;
  preferredLanguage: string;
  knowledgeGap?: string | null;
  prerequisiteTopic?: string | null;
  course: string;
  userRole?: 'learner' | 'admin';
  designation?: string;
  department?: string;
  currentRole?: string;
  targetRole?: string;
  topSkillGaps?: { competency: string; gap: number }[];
  recommendedCourses?: { title: string; provider: string; why: string }[];
  latestAssessmentScore?: number;
  uploadedMaterialTitle?: string;
  workforceTopGap?: { competency: string; gap: number; affected: number };
};

export const actionLabels: Record<CopilotAction, string> = {
  explain: 'Explain concept', hint: 'Give a hint', example: 'Show example', practice: 'Try practice', repair: 'Repair prerequisite', next: 'Next step', explain_gap: 'Explain skill gap', why_recommended: 'Why recommended?', mistake: 'Explain my mistake', admin_top_gap: 'What is top workforce gap?', admin_dept: 'Department analysis', admin_rec: 'Executive recommendations',
};

export async function getLearningCopilotReply({ message, action, context }: { message: string; action?: CopilotAction; context: LearningCopilotContext; }): Promise<{ message: string; actions: CopilotAction[] }> {
  const lower = message.toLowerCase();
  if (context.userRole === 'admin' || action?.startsWith('admin_')) {
    if (action === 'admin_top_gap' || lower.includes('biggest') || lower.includes('top gap')) {
      const topGap = context.workforceTopGap || { competency: 'AI & Machine Learning', gap: 27, affected: 9 };
      return { message: `The top organizational skill gap across MoSPI workforce learners is ${topGap.competency} with an average gap of ${topGap.gap} points affecting ${topGap.affected} officers. Implementing targeted iGOT/NSSTA upskilling cohorts is recommended.`, actions: ['admin_rec', 'admin_dept', 'why_recommended'] };
    }
    if (action === 'admin_dept' || lower.includes('department')) return { message: 'Data Informatics & Innovation Division (DIID) and Survey Design & Research Division (SDRD) show high technical competency gaps in SQL and AI/ML. National Accounts Division leads in GDP & SNA 2008 compilation mastery.', actions: ['admin_top_gap', 'admin_rec'] };
    if (action === 'admin_rec' || lower.includes('recommendation') || lower.includes('prioritize')) return { message: 'Actionable Executive Recommendations:\n1. Deploy AI/ML e-learning cohort on iGOT Karmayogi (27pt deficit, 9 officers affected).\n2. Schedule NSSTA hands-on SQL query workshop for NAD & SDRD officers.\n3. Mandate 4-hour DPDP Act privacy module before statistical releases.', actions: ['admin_top_gap', 'admin_dept'] };
  }
  if (action === 'repair' || context.knowledgeGap) return { message: `The adaptive engine identified a knowledge gap in ${context.prerequisiteTopic ?? context.knowledgeGap ?? 'a prerequisite'}. Grounding this prerequisite before advancing to ${context.currentTopic} will increase your overall concept confidence by up to 35%.`, actions: ['explain', 'example', 'repair'] };
  if (action === 'mistake' || lower.includes('mistake') || lower.includes('score')) return { message: context.latestAssessmentScore !== undefined ? `Your latest competency assessment score was ${context.latestAssessmentScore}%. Mistakes in specific question concepts indicate areas where reviewing prerequisite definitions (e.g. WHERE vs HAVING in SQL or Pandas DataFrames in Python) will improve your score.` : 'Take the competency assessment generated from learning materials to receive detailed feedback on your mistakes and score impact.', actions: ['explain', 'practice', 'next'] };
  if (action === 'explain_gap' || lower.includes('gap')) { const topGap = context.topSkillGaps?.[0]; if (topGap) return { message: `Your current competency in ${topGap.competency} is lower than required for your target role (${context.targetRole ?? 'Target Role'}). Addressing a ${topGap.gap}-point gap in ${topGap.competency} is prioritized in your custom MoSPI learning roadmap.`, actions: ['why_recommended', 'practice', 'next'] }; }
  if (action === 'why_recommended' || lower.includes('recommend') || lower.includes('course')) { const topRec = context.recommendedCourses?.[0]; if (topRec) return { message: `The course "${topRec.title}" from ${topRec.provider} was recommended because: ${topRec.why}`, actions: ['explain', 'practice', 'next'] }; return { message: `Training courses are selected dynamically based on your MoSPI target role (${context.targetRole ?? 'Statistical Analyst'}). Courses targeting high-priority skill gaps (e.g. Python, SQL, Survey Design) appear at the top of your iGOT/NSSTA repository feed.`, actions: ['explain', 'practice', 'next'] }; }
  if (action === 'hint' || lower.includes('hint')) return { message: `Hint for ${context.currentTopic}: Focus on syntax structure and how data flows from variables into functions. Look closely at parameter definitions.`, actions: ['explain', 'example', 'practice'] };
  if (action === 'example' || lower.includes('example')) return { message: `Here is a practical example in ${context.currentTopic}:\n\`\`\`python\n# Example of ${context.currentTopic}\ndef calculate_index(data):\n    return sum(data) / len(data)\n\nresult = calculate_index([10, 20, 30])\nprint("Index:", result)\n\`\`\``, actions: ['explain', 'practice', 'next'] };
  return { message: context.userRole === 'admin' ? `I'm PathPilot Workforce Intelligence Copilot. I can assist with organization-wide skill gaps, department analytics, and executive training priorities.` : `I'm tracking your journey through ${context.course} for target role ${context.targetRole ?? 'Statistical Analyst'}. Your current signal is ${context.topicMastery}%. Ask for a simple explanation, a hint, an assessment mistake explanation, or skill gap details.`, actions: context.userRole === 'admin' ? ['admin_top_gap', 'admin_dept', 'admin_rec'] : context.knowledgeGap ? ['explain', 'example', 'repair'] : ['explain', 'why_recommended', 'mistake', 'hint', 'example', 'practice', 'next'] };
}
