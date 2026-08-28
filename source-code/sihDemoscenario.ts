import type { ProfileData } from '../pages/ProfilePage';

export const JUDGE_DEMO_PROFILE: ProfileData = {

  name: 'Dr. Rajesh Sharma',

  goal: 'Build statistical & analytical tools',

  experience: 'I have built small scripts',

  designation: 'Senior Statistical Officer',

  department: 'National Accounts Division (NAD)',

  currentAssignment: 'GDP Quarterly Estimates Compilation & Data Audit',

  yearsOfExperience: '4-7 years',

  currentRole: 'stat_officer',

  targetRole: 'stat_analyst',

  education: 'Master in Statistics / Economics',

  previousTraining: 'NSSTA Basic Officer Training (2023)',

};

export const JUDGE_DEMO_COMPETENCIES: Record<string, number> = {

  tech_python: 62,

  tech_sql: 38,

  tech_aiml: 35,

  tech_datavis: 55,

  stat_survey_design: 65,

  stat_national_accounts: 60,

  stat_data_quality: 75,

  gov_privacy: 60,

  mgt_ethics: 70,

};

export const JUDGE_DEMO_TOPICS = [

{ id: 0, title: 'Python Basics', blurb: 'Your first bearings: syntax, comments, and running a script.', mastery: 85, status: 'mastered' as const, minutes: 18 },

{ id: 1, title: 'Variables & Data Types', blurb: 'Give information a useful shape and name.', mastery: 82, status: 'mastered' as const, minutes: 22 },

{ id: 2, title: 'Conditional Statements', blurb: 'Teach your program how to choose.', mastery: 62, status: 'guided' as const, minutes: 26 },

{ id: 3, title: 'Loops', blurb: 'Repeat the useful part, not the confusing part.', mastery: 40, status: 'repair' as const, minutes: 28 },

{ id: 4, title: 'Functions', blurb: 'Package a thought so you can use it again.', mastery: 0, status: 'upcoming' as const, minutes: 32 },

{ id: 5, title: 'Lists & Dictionaries', blurb: 'Work with collections that stay organized.', mastery: 0, status: 'upcoming' as const, minutes: 34 },

{ id: 6, title: 'File Handling', blurb: 'Let your programs remember things.', mastery: 0, status: 'upcoming' as const, minutes: 30 },

{ id: 7, title: 'Mini Project', blurb: 'Bring the whole route together in a small tool.', mastery: 0, status: 'upcoming' as const, minutes: 45 },

];

export function loadJudgeDemo() {

  localStorage.setItem('pp-profile', JSON.stringify(JUDGE_DEMO_PROFILE));

  localStorage.setItem('pp-competencies', JSON.stringify(JUDGE_DEMO_COMPETENCIES));

  localStorage.setItem('pp-topics', JSON.stringify(JUDGE_DEMO_TOPICS));

  localStorage.setItem('pp-user-role', JSON.stringify('learner'));

return {

    profile: JUDGE_DEMO_PROFILE,

    competencies: JUDGE_DEMO_COMPETENCIES,

    topics: JUDGE_DEMO_TOPICS,

    userRole: 'learner' as const,

};

}

export function resetJudgeDemo() {

  localStorage.removeItem('pp-profile');

  localStorage.removeItem('pp-competencies');

  localStorage.removeItem('pp-topics');

  localStorage.removeItem('pp-user-role');

  localStorage.removeItem('pp-user');

return {

    profile: JUDGE_DEMO_PROFILE,

    competencies: JUDGE_DEMO_COMPETENCIES,

    topics: JUDGE_DEMO_TOPICS,

    userRole: 'learner' as const,

};

}

export function getJudgeDemoState() {

try {

const p = localStorage.getItem('pp-profile');

const c = localStorage.getItem('pp-competencies');

const t = localStorage.getItem('pp-topics');

const r = localStorage.getItem('pp-user-role');

return {

      profile: p ? JSON.parse(p) as ProfileData : JUDGE_DEMO_PROFILE,

      competencies: c ? JSON.parse(c) as Record<string, number> : JUDGE_DEMO_COMPETENCIES,

      topics: t ? JSON.parse(t) : JUDGE_DEMO_TOPICS,

      userRole: r ? JSON.parse(r) as 'learner' | 'admin' : 'learner',

};

} catch {

return {

      profile: JUDGE_DEMO_PROFILE,

      competencies: JUDGE_DEMO_COMPETENCIES,

      topics: JUDGE_DEMO_TOPICS,

      userRole: 'learner' as const,

};

}

}