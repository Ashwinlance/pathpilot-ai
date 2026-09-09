import { type ReactNode, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft, ArrowRight, Award, BookOpen, Bot, BrainCircuit, Check, CheckCircle2,
  ChevronRight, HelpCircle, Clock3, Code2, Compass, Download, FileText,
  Focus, Gauge, Home, Info, Laptop, Lightbulb, MessageCircle,
  ListChecks, Play, Plus, RotateCcw, Route as RouteIcon, Send,
  Settings, ShieldCheck, Sparkles, Target, Trophy, UserRound, Video,
  X, Zap
} from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { type CopilotAction, type LearningCopilotContext } from './lib/learningCopilotService';
import { AppSidebar, ModeToggle, Logo } from './components/AppSidebar';
import { AdaptiveLoop, loopStepForPath } from './components/AdaptiveLoop';
import { CopilotFab, LearningCopilotPanel } from './components/LearningCopilotPanel';
import { ProfilePage, type ProfileData } from './pages/ProfilePage';
import { CompetencyProfilePage } from './pages/CompetencyProfilePage';
import { TrainingRecommendationsPage } from './pages/TrainingRecommendationsPage';
import { MaterialUploadPage } from './pages/MaterialUploadPage';
import { MCQGeneratorPage } from './pages/MCQGeneratorPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';
import { calculateSkillGaps } from './lib/skillGapEngine';
import { getTrainingRecommendations } from './lib/recommendationEngine';
import { getWorkforceAnalyticsSummary } from './lib/workforceAnalytics';
import { SAMPLE_MATERIALS, type ExtractedMaterial, type GeneratedMCQ } from './lib/mcqGenerator';
import type { AssessmentResult } from './lib/assessmentEngine';
import { loadJudgeDemo, resetJudgeDemo, getJudgeDemoState, JUDGE_DEMO_PROFILE, JUDGE_DEMO_COMPETENCIES, JUDGE_DEMO_TOPICS } from './lib/sihDemoScenario';

type Mode = 'beginner' | 'experienced';
type UserRole = 'learner' | 'admin';
type Status = 'mastered' | 'guided' | 'repair' | 'upcoming';
type Topic = { id: number; title: string; blurb: string; mastery: number; status: Status; minutes: number };

const topicsSeed = [
  ['Python Basics', 'Your first bearings: syntax, comments, and running a script.', 24],
  ['Variables & Data Types', 'Give information a useful shape and name.', 18],
  ['Conditional Statements', 'Teach your program how to choose.', 9],
  ['Loops', 'Repeat the useful part, not the confusing part.', 0],
  ['Functions', 'Package a thought so you can use it again.', 0],
  ['Lists & Dictionaries', 'Work with collections that stay organized.', 0],
  ['File Handling', 'Let your programs remember things.', 0],
  ['Mini Project', 'Bring the whole route together in a small tool.', 0],
] as const;

const createTopics = (mode: Mode, experienced = false): Topic[] => topicsSeed.map(([title, blurb, beginnerMastery], id) => {
  const mastery = mode === 'experienced'
    ? [100, 96, 86, 82, 68, 51, 18, 0][id]
    : experienced ? [83, 81, 62, 37, 0, 0, 0, 0][id] : beginnerMastery;
  const status: Status = mastery >= 80 ? 'mastered' : mastery >= 50 ? 'guided' : mastery > 0 ? 'repair' : 'upcoming';
  return { id, title, blurb, mastery, status, minutes: [18, 22, 26, 28, 32, 34, 30, 45][id] };
});

const readStore = <T,>(key: string, fallback: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
};

const saveStore = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value));

function cx(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function Button({ children, onClick, variant = 'primary', className, disabled, testId = 'button-action', type = 'button' }: {
  children: ReactNode; onClick?: () => void; variant?: 'primary' | 'secondary' | 'quiet' | 'coral'; className?: string; disabled?: boolean; testId?: string; type?: 'button' | 'submit';
}) {
  return <button type={type} data-testid={testId} disabled={disabled} onClick={onClick} className={cx(
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45',
    variant === 'primary' && 'bg-primary text-primary-foreground shadow-sm hover:-translate-y-0.5',
    variant === 'secondary' && 'border border-border bg-card text-foreground hover:border-primary hover:bg-secondary',
    variant === 'quiet' && 'text-muted-foreground hover:bg-secondary hover:text-foreground',
    variant === 'coral' && 'bg-accent text-accent-foreground shadow-sm hover:-translate-y-0.5',
    className
  )}>{children}</button>;
}

function TopBar({ mode, setMode, onExit, onFocus, focusMode, topics }: { mode: Mode; setMode: (mode: Mode) => void; onExit: () => void; onFocus?: () => void; focusMode?: boolean; topics: Topic[] }) {
  const current = topics.find(topic => topic.status !== 'mastered');
  return <header className="top-bar flex min-h-[72px] items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur sm:px-8">
    <div className="flex items-center gap-3 lg:hidden"><Logo /></div>
    <div className="focus-title hidden items-center gap-2 text-sm font-semibold text-muted-foreground"><Focus size={16} className="text-primary" /> Focus mode <span className="text-xs font-normal">· one thing at a time</span></div>
    <div className="ml-auto flex items-center gap-2 sm:gap-4">
      <ModeToggle mode={mode} setMode={setMode} />
      <div className="hidden items-center gap-2 border-l border-border pl-4 text-xs text-muted-foreground md:flex"><RouteIcon size={15} className="text-primary" /><span>Current: <strong className="text-foreground">{current?.title ?? 'Course complete'}</strong></span></div>
      {onFocus && <button data-testid="button-focus-mode" onClick={onFocus} className={cx('hidden rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground sm:block', focusMode && 'bg-secondary text-primary')}><Focus size={18} /></button>}
      <button data-testid="button-top-exit" onClick={onExit} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground" title="Leave course"><ArrowLeft size={18} /></button>
    </div>
  </header>;
}

function Shell({
  children,
  mode,
  setMode,
  userRole,
  setUserRole,
  onStartJudgeDemo,
  onResetJudgeDemo,
  onExit,
  onFocus,
  focusMode,
  topics,
  location,
  copilotContext,
  copilotOpen,
  copilotSeed,
  onOpenCopilot,
  onCloseCopilot,
  onSeedHandled,
  onRepairCopilot,
}: {
  children: ReactNode;
  mode: Mode;
  setMode: (mode: Mode) => void;
  userRole: UserRole;
  setUserRole: (r: UserRole) => void;
  onStartJudgeDemo: () => void;
  onResetJudgeDemo: () => void;
  onExit: () => void;
  onFocus?: () => void;
  focusMode?: boolean;
  topics: Topic[];
  location: string;
  copilotContext: LearningCopilotContext;
  copilotOpen: boolean;
  copilotSeed: { id: number; prompt: string } | null;
  onOpenCopilot: (prompt?: string) => void;
  onCloseCopilot: () => void;
  onSeedHandled: () => void;
  onRepairCopilot: () => void;
}) {
  const copilotEnabled = ['/roadmap', '/learning', '/practice', '/gap', '/competency', '/training', '/materials', '/mcq-generator', '/assessment', '/admin', '/progress'].includes(location);
  return (
    <div className={cx('min-h-[100dvh] bg-background', focusMode && 'focus-shell')}>
      <AppSidebar mode={mode} setMode={setMode} userRole={userRole} setUserRole={setUserRole} onStartJudgeDemo={onStartJudgeDemo} onResetJudgeDemo={onResetJudgeDemo} onExit={onExit} topics={topics} />
      <div className="app-main min-h-[100dvh] lg:ml-[248px]">
        <TopBar mode={mode} setMode={setMode} onExit={onExit} onFocus={onFocus} focusMode={focusMode} topics={topics} />
        <main className="page-enter px-4 pb-28 pt-5 sm:px-8 sm:pb-28 sm:pt-7 lg:px-12 lg:pb-10">
          <div className="mx-auto mb-6 max-w-6xl">
            <AdaptiveLoop compact current={loopStepForPath(location)} />
          </div>
          {children}
        </main>
      </div>
      {copilotEnabled && (
        <>
          <CopilotFab onClick={() => onOpenCopilot()} />
          <LearningCopilotPanel
            open={copilotOpen}
            onClose={onCloseCopilot}
            context={copilotContext}
            onRepair={onRepairCopilot}
            initialPrompt={copilotSeed}
            onInitialPromptHandled={onSeedHandled}
          />
        </>
      )}
    </div>
  );
}

// Landing Page
function Landing({ go, mode, setMode, onStartJudgeDemo }: { go: (path: string) => void; mode: Mode; setMode: (mode: Mode) => void; onStartJudgeDemo: () => void }) {
  return (
    <div className="min-h-[100dvh] overflow-hidden bg-background">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-10">
        <Logo />
        <div className="flex items-center gap-2">
          <button
            onClick={onStartJudgeDemo}
            data-testid="button-landing-sih-demo"
            className="rounded-xl bg-accent px-4 py-2 text-sm font-bold text-accent-foreground shadow-md transition hover:brightness-110"
          >
            START SIH DEMO <Play size={15} className="inline ml-1" />
          </button>
          <Button onClick={() => go('/courses')} variant="secondary" testId="button-landing-start">
            Start Learning <ArrowRight size={16} />
          </Button>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-5 pb-16 pt-9 sm:px-10 sm:pt-16">
        <section className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-20">
          <div className="relative z-10 max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> MoSPI Official Statistical System Adaptive Engine
            </div>
            <h1 className="font-serif text-[3.7rem] font-bold leading-[.97] tracking-[-.065em] text-foreground sm:text-[5.8rem]">
              Find your way<br />
              <span className="text-primary">to capable.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg">
              PathPilot ingests learning materials, generates competency-mapped MCQs, evaluates skill gaps, and drives workforce intelligence for MoSPI.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button
                onClick={onStartJudgeDemo}
                data-testid="button-hero-sih-demo"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-md transition hover:brightness-110"
              >
                <span>START SIH DEMO</span>
                <Play size={16} />
              </button>
              <Button onClick={() => go('/courses')} variant="secondary" testId="button-hero-start">
                Explore Courses <ArrowRight size={16} />
              </Button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[510px]">
            <div className="relative rounded-[2rem] border border-border bg-card p-5 shadow-lg sm:p-7">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">Today's route</p>
                  <p className="mt-1 font-serif text-2xl font-bold">Python · Official Statistics</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[hsl(42_72%_83%)] text-[hsl(30_48%_28%)]">
                  <Target size={21} />
                </span>
              </div>
              <div className="py-5 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-bold"><Check size={16} /></span>
                  <div><p className="text-sm font-bold">Python Basics</p><p className="text-xs text-muted-foreground">Mastered</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-accent-foreground text-xs font-bold"><Compass size={16} /></span>
                  <div><p className="text-sm font-bold">Variables & Data Types</p><p className="text-xs text-primary font-semibold">Current landmark</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="mt-20" aria-label="Adaptive learning loop">
          <AdaptiveLoop current={0} />
        </section>
      </main>
    </div>
  );
}

// Course Selection Page
function CourseSelection({ go }: { go: (path: string) => void }) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-primary">MoSPI Course Library</p>
        <h1 className="font-serif text-4xl font-bold tracking-[-.045em] sm:text-5xl">Choose your landmark course.</h1>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <button
          data-testid="card-course-python"
          onClick={() => go('/profile')}
          className="group relative overflow-hidden rounded-[1.6rem] bg-sidebar p-7 text-left text-sidebar-foreground shadow-md transition hover:-translate-y-1 sm:p-9"
        >
          <div className="relative">
            <span className="rounded-full border border-sidebar-primary/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[.13em] text-sidebar-primary">Official System Track</span>
            <p className="mt-8 text-[11px] font-bold uppercase tracking-[.18em] text-sidebar-primary">Python Programming</p>
            <h2 className="mt-2 font-serif text-4xl font-bold tracking-[-.045em] sm:text-5xl">Official Statistics Fundamentals</h2>
            <p className="mt-4 text-sm leading-6 text-sidebar-foreground/65">From your first variable to survey automation. Adapts to your MoSPI competency requirements.</p>
            <div className="mt-8 inline-flex items-center gap-2 rounded-xl bg-sidebar-primary px-4 py-2.5 text-sm font-bold text-sidebar-primary-foreground transition">
              Begin Competency Route <ArrowRight size={16} />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

// Diagnostic Page
function DiagnosticPage({ mode, setProgress, go }: { mode: Mode; setProgress: (topics: Topic[]) => void; go: (path: string) => void }) {
  const questions = [
    ['What does `len("route")` return?', ['4', '5', '6'], 1],
    ['Which value is a Boolean?', ['"True"', 'True', '1'], 1],
    ['What prints first?', ['print("start")', 'print("finish")', 'Nothing'], 0],
    ['Which symbol checks equality?', ['=', '==', '!='], 1],
  ] as const;
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [notice, setNotice] = useState('');
  const score = Math.round((questions.reduce((sum, q, i) => sum + (answers[i] === q[2] ? 1 : 0), 0) / questions.length) * 100);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-primary">A gentle check-in</p>
        <h1 className="font-serif text-4xl font-bold tracking-[-.045em]">Let’s find your starting bearings.</h1>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
        <div className="space-y-4">
          {questions.map(([question, options], index) => (
            <div key={question} className="rounded-2xl border border-border bg-card p-5">
              <p className="font-semibold text-sm font-mono text-primary mb-2">0{index + 1} · {question}</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {options.map((option, optionIndex) => (
                  <button
                    key={option}
                    data-testid={`button-diagnostic-${index}-${optionIndex}`}
                    onClick={() => setAnswers({ ...answers, [index]: optionIndex })}
                    className={cx('rounded-xl border px-3 py-2.5 text-left font-mono text-xs transition', answers[index] === optionIndex ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-border bg-background hover:border-primary/50')}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <aside className="rounded-2xl bg-secondary/70 p-5 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Answered</p>
          <p className="font-serif text-3xl font-bold">{Object.keys(answers).length} / {questions.length}</p>
          <Button
            onClick={() => {
              if (Object.keys(answers).length < questions.length) {
                setNotice('Choose an answer for each question so the route can read your signal.');
                return;
              }
              setProgress(createTopics(mode, score >= 75));
              go('/roadmap');
            }}
            variant="primary"
            className="w-full"
            testId="button-diagnostic-submit"
          >
            See my route <ArrowRight size={15} />
          </Button>
          {notice && <p className="text-xs font-semibold text-accent">{notice}</p>}
        </aside>
      </div>
    </div>
  );
}

// Roadmap Page
function RoadmapPage({ topics, mode, go, updated }: { topics: Topic[]; mode: Mode; go: (path: string) => void; updated: boolean }) {
  const next = topics.find(t => t.status !== 'mastered');
  const average = Math.round(topics.reduce((a, t) => a + t.mastery, 0) / topics.length);
  const mastered = topics.filter(t => t.status === 'mastered').length;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-primary">{updated ? 'Route recalculated' : 'Your adaptive roadmap'}</p>
        <h1 className="font-serif text-4xl font-bold tracking-[-.045em]">{updated ? 'The next landmark is clearer now.' : 'A route built around your signal.'}</h1>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.18fr_.82fr]">
        <div className="rounded-[1.5rem] border border-border bg-card p-5 sm:p-7 space-y-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-serif text-xl font-bold">Ordered Landmarks</h3>
            <span className="font-mono text-xs text-muted-foreground">{mastered}/{topics.length} complete</span>
          </div>
          {topics.map((topic, i) => (
            <div key={topic.id} className={cx('flex items-center justify-between rounded-xl p-3 border', next?.id === topic.id ? 'border-primary bg-primary/5' : 'border-border')}>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-muted-foreground">0{i + 1}</span>
                <div>
                  <p className="text-sm font-semibold">{topic.title}</p>
                  <p className="text-xs text-muted-foreground">{topic.mastery}% signal · {topic.minutes} min</p>
                </div>
              </div>
              {next?.id === topic.id && (
                <Button onClick={() => go('/learning')} variant="coral" className="text-xs py-1.5 px-3">
                  Start Landmark
                </Button>
              )}
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="rounded-[1.5rem] border border-border bg-secondary/80 p-6 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Next Action</p>
            <h3 className="font-serif text-2xl font-bold text-foreground">{next?.title ?? 'Route Complete'}</h3>
            <p className="text-xs leading-5 text-muted-foreground">{next?.blurb}</p>
            {next && <Button onClick={() => go('/learning')} variant="coral" className="w-full">Start Landmark <ArrowRight size={15} /></Button>}
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard
function Dashboard({ topics, profile, mode, go }: { topics: Topic[]; profile: ProfileData; mode: Mode; go: (path: string) => void }) {
  const next = topics.find(t => t.status !== 'mastered') ?? topics[topics.length - 1];
  const overallSignal = Math.round(topics.reduce((sum, t) => sum + t.mastery, 0) / topics.length);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-primary">Good to see you back</p>
        <h1 className="font-serif text-4xl font-bold tracking-[-.045em]">
          Keep finding your way{profile.name ? `, ${profile.name}` : ''}.
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          MoSPI Role: <strong className="text-foreground">{profile.designation || 'Senior Statistical Officer'}</strong> ({profile.department || 'National Accounts Division'})
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <div className="rounded-[1.6rem] bg-sidebar p-6 text-sidebar-foreground shadow-md sm:p-8 space-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-sidebar-primary">Your Next Move</p>
            <h2 className="mt-2 font-serif text-3xl font-bold">{next.title}</h2>
            <p className="mt-2 text-sm text-sidebar-foreground/65">{next.blurb}</p>
          </div>
          <Button onClick={() => go('/learning')} variant="coral" testId="button-dashboard-continue">
            Continue <ArrowRight size={15} />
          </Button>
        </div>

        <div className="rounded-[1.6rem] border border-border bg-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">Route Pulse</p>
              <p className="font-serif text-4xl font-bold">{overallSignal}%</p>
            </div>
            <Gauge size={28} className="text-primary" />
          </div>
          <div className="space-y-2">
            <Link href="/competency" className="block text-xs font-bold text-primary hover:underline">
              <Award size={14} className="inline mr-1" /> View Competency Profile & Skill Gaps →
            </Link>
            <Link href="/training" className="block text-xs font-bold text-primary hover:underline">
              <BookOpen size={14} className="inline mr-1" /> View Recommended iGOT / NSSTA Courses →
            </Link>
            <Link href="/materials" className="block text-xs font-bold text-primary hover:underline">
              <FileText size={14} className="inline mr-1" /> Upload Material & Generate Assessment →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Learning Landmark Lesson Page
function getTopicBreakdown(title: string) {
  const lower = title.toLowerCase();
  if (lower.includes('dict') || lower.includes('list')) {
    return {
      explanation: 'Python dictionaries allow storing structured statistical survey records as key-value pairs. Values can be efficiently retrieved, updated, or analyzed using unique keys.',
      code: `survey_record = {\n    "age": 32,\n    "employment_status": "employed"\n}\n\nprint(survey_record["age"])`,
    };
  }
  if (lower.includes('variable') || lower.includes('data type')) {
    return {
      explanation: 'Variables store survey data values in memory. Python assigns data types such as integers, floats, strings, and booleans based on assigned values.',
      code: `survey_id = 1042\nsample_weight = 1.45\nis_verified = True\n\nprint("Survey ID:", survey_id)`,
    };
  }
  if (lower.includes('condition')) {
    return {
      explanation: 'Conditional statements (if/elif/else) allow automated survey data validation and filtering based on logical evaluation rules.',
      code: `monthly_income = 45000\nif monthly_income > 40000:\n    category = "High"\nelse:\n    category = "Standard"`,
    };
  }
  if (lower.includes('loop')) {
    return {
      explanation: 'Loops (for/while) iterate over lists of survey observations to clean, aggregate, or recalculate values without repeating code.',
      code: `sample_ages = [24, 30, 28, 35]\nfor age in sample_ages:\n    print("Respondent age:", age)`,
    };
  }
  if (lower.includes('function')) {
    return {
      explanation: 'Functions encapsulate reusable statistical logic, taking inputs and returning computed indicators or summary figures.',
      code: `def calc_growth(current, previous):\n    return ((current - previous) / previous) * 100\n\nprint("GDP Growth:", calc_growth(105, 100))`,
    };
  }
  if (lower.includes('file')) {
    return {
      explanation: 'File handling reads and writes external survey datasets (such as CSV files), persisting data across analytical sessions.',
      code: `import csv\nwith open("survey.csv", "r") as f:\n    reader = csv.reader(f)\n    for row in reader:\n        print(row)`,
    };
  }
  return {
    explanation: `In Python for official statistics, ${title.toLowerCase()} provides the core logic to manipulate and process survey data schedules.`,
    code: `# Python Code Example for ${title}\ndata_points = [12.5, 14.8, 19.2]\nprint("Sum:", sum(data_points))`,
  };
}

function LearningPage({ topic, go, onOpenCopilot }: { topic: Topic; go: (path: string) => void; onOpenCopilot: (prompt?: string) => void }) {
  const breakdown = getTopicBreakdown(topic.title);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-primary">Landmark Lesson</p>
        <h1 className="font-serif text-4xl font-bold">{topic.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{topic.blurb}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-serif text-lg font-bold">Key Concept Breakdown</h3>
        <p className="text-sm leading-6 text-muted-foreground">
          {breakdown.explanation}
        </p>
        <div className="rounded-xl bg-secondary p-4 font-mono text-xs whitespace-pre">
          <code>{breakdown.code}</code>
        </div>
        <div className="flex flex-wrap gap-3 pt-3">
          <Button onClick={() => go('/practice')} variant="primary">
            Take Practice Quiz <ArrowRight size={15} />
          </Button>
          <Button onClick={() => onOpenCopilot(`Explain ${topic.title} simply`)} variant="secondary">
            Ask Copilot to Explain
          </Button>
        </div>
      </div>
    </div>
  );
}

// Practice Page
function PracticePage({ topic, go, setTopics }: { topic: Topic; go: (path: string) => void; setTopics: React.Dispatch<React.SetStateAction<Topic[]>> }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const options = ['Syntax error', 'Valid execution storing key-value pairs', 'Unexpected type conversion'];
  const correct = 1;

  const handleSubmit = () => {
    setSubmitted(true);
    if (selected === correct) {
      setTopics(current => current.map(t => t.id === topic.id ? { ...t, mastery: Math.min(100, t.mastery + 35), status: 'mastered' } : t));
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-primary">Practice Challenge</p>
        <h1 className="font-serif text-3xl font-bold">{topic.title} Evaluation</h1>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <p className="text-sm font-semibold">Which statement accurately describes how dictionaries store statistical survey variables in Python?</p>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <button
              key={opt}
              onClick={() => setSelected(i)}
              className={cx('w-full rounded-xl border p-3.5 text-left text-xs font-semibold transition', selected === i ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:bg-secondary')}
            >
              {opt}
            </button>
          ))}
        </div>

        {!submitted ? (
          <Button onClick={handleSubmit} disabled={selected === null} variant="primary" className="w-full">
            Submit Answer
          </Button>
        ) : (
          <div className="space-y-4 pt-2">
            <p className={cx('text-sm font-bold', selected === correct ? 'text-[hsl(162_46%_27%)]' : 'text-accent')}>
              {selected === correct ? '✓ Correct! Mastery signal updated.' : '× Partial understanding. Prerequisite repair recommended.'}
            </p>
            <Button onClick={() => go('/roadmap')} variant="primary" className="w-full">
              Return to Roadmap <ArrowRight size={15} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Simulated Live Class Page
function LiveClassSim({ go }: { go: (path: string) => void }) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-primary">Simulated Live Class</p>
        <h1 className="font-serif text-4xl font-bold">Variables & Official Data Streams</h1>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="aspect-video w-full rounded-xl bg-sidebar flex items-center justify-center text-sidebar-foreground">
          <div className="text-center space-y-2">
            <Video size={48} className="mx-auto text-sidebar-primary" />
            <p className="font-serif font-bold text-lg">Live AI Instructor Stream</p>
            <p className="text-xs text-sidebar-foreground/60">Module: Survey Data Structures in Python</p>
          </div>
        </div>
        <Button onClick={() => go('/learning')} variant="primary">
          Back to Lesson <ArrowRight size={15} />
        </Button>
      </div>
    </div>
  );
}

// Class Notes Page
function ClassNotes({ go }: { go: (path: string) => void }) {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[.18em] text-primary">Official Reference Notes</p>
        <h1 className="font-serif text-4xl font-bold">Python for MoSPI Officers — Study Guide</h1>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <div className="rounded-xl bg-secondary/60 p-4 text-xs font-mono space-y-2">
          <p className="font-bold text-foreground"># MoSPI Python Quick Reference Sheet</p>
          <p># 1. Loading CSV Micro-data</p>
          <p>import pandas as pd<br />df = pd.read_csv("ASI_2023_Schedule.csv")</p>
          <p># 2. Key Data Quality Check</p>
          <p>print(df.isnull().sum())</p>
        </div>
        <Button onClick={() => window.alert('Study Guide downloaded locally.')} variant="secondary">
          Download PDF Notes <Download size={15} />
        </Button>
      </div>
    </div>
  );
}

// Main App Component
export default function App() {
  const [location, setLocation] = useLocation();

  const [mode, setMode] = useState<Mode>('beginner');

  // Single Source of Truth Learner State with fallback to Judge Demo State
  const initialDemoState = getJudgeDemoState();
  const [userRole, setUserRole] = useState<UserRole>(() => initialDemoState.userRole);
  const [topics, setTopics] = useState<Topic[]>(() => initialDemoState.topics);
  const [profile, setProfile] = useState<ProfileData>(() => initialDemoState.profile);
  const [demonstratedCompetencies, setDemonstratedCompetencies] = useState<Record<string, number>>(() => initialDemoState.competencies);

  const [activeMaterial, setActiveMaterial] = useState<ExtractedMaterial>(SAMPLE_MATERIALS[0]);
  const [publishedQuestions, setPublishedQuestions] = useState<GeneratedMCQ[]>([]);
  const [lastAssessmentResult, setLastAssessmentResult] = useState<AssessmentResult | null>(null);

  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotSeed, setCopilotSeed] = useState<{ id: number; prompt: string } | null>(null);

  useEffect(() => {
    saveStore('pp-topics', topics);
  }, [topics]);

  useEffect(() => {
    saveStore('pp-profile', profile);
  }, [profile]);

  useEffect(() => {
    saveStore('pp-competencies', demonstratedCompetencies);
  }, [demonstratedCompetencies]);

  useEffect(() => {
    saveStore('pp-user-role', userRole);
  }, [userRole]);

  const currentTopic = topics.find(t => t.status !== 'mastered') ?? topics[0];

  // Sync Python landmark average to tech_python demonstrated level
  useEffect(() => {
    const pythonMasteryAverage = Math.round(topics.reduce((s, t) => s + t.mastery, 0) / topics.length);
    setDemonstratedCompetencies(prev => ({ ...prev, tech_python: pythonMasteryAverage }));
  }, [topics]);

  const skillGapOverview = calculateSkillGaps(profile.targetRole || 'stat_analyst', demonstratedCompetencies);
  const recommendations = getTrainingRecommendations(profile.targetRole || 'stat_analyst', demonstratedCompetencies);
  const workforceSummary = getWorkforceAnalyticsSummary();

  const copilotContext: LearningCopilotContext = {
    currentTopic: currentTopic.title,
    learnerLevel: mode === 'beginner' ? 'Beginner' : 'Experienced',
    topicMastery: currentTopic.mastery,
    preferredLanguage: 'English',
    course: 'Python for Official Statistics',
    userRole,
    designation: profile.designation,
    department: profile.department,
    targetRole: skillGapOverview.role.title,
    topSkillGaps: skillGapOverview.topPriorityGaps.map(g => ({ competency: g.competencyName, gap: g.gap })),
    recommendedCourses: recommendations.slice(0, 3).map(r => ({ title: r.course.title, provider: r.course.provider, why: r.whyRecommended })),
    latestAssessmentScore: lastAssessmentResult?.scorePercentage,
    uploadedMaterialTitle: activeMaterial.title,
    workforceTopGap: workforceSummary.topOrgSkillGaps[0] ? { competency: workforceSummary.topOrgSkillGaps[0].competencyName, gap: workforceSummary.topOrgSkillGaps[0].gap, affected: workforceSummary.topOrgSkillGaps[0].affectedLearnersCount } : undefined,
  };

  const handleOpenCopilot = (prompt?: string) => {
    if (prompt) {
      setCopilotSeed({ id: Date.now(), prompt });
    }
    setCopilotOpen(true);
  };

  const handleCompleteAssessment = (result: AssessmentResult) => {
    setLastAssessmentResult(result);
    // Directly update central demonstratedCompetencies state
    setDemonstratedCompetencies(result.updatedDemonstratedCompetencies);

    if (result.scorePercentage < 50) {
      setTopics(current => current.map((t, idx) => idx === 3 ? { ...t, status: 'repair', mastery: 15 } : t));
    }
  };

  const handleStartJudgeDemo = () => {
    const demoState = loadJudgeDemo();
    setProfile(demoState.profile);
    setDemonstratedCompetencies(demoState.competencies);
    setTopics(demoState.topics);
    setUserRole('learner');
    setLocation('/competency');
  };

  const handleResetJudgeDemo = () => {
    const defaultState = resetJudgeDemo();
    setProfile(defaultState.profile);
    setDemonstratedCompetencies(defaultState.competencies);
    setTopics(defaultState.topics);
    setUserRole('learner');
    setLocation('/competency');
  };

  const go = (path: string) => setLocation(path);

  return (
    <WouterRouter>
      <Switch>
        <Route path="/">
          <Landing go={go} mode={mode} setMode={setMode} onStartJudgeDemo={handleStartJudgeDemo} />
        </Route>

        <Route path="/admin">
          <Shell mode={mode} setMode={setMode} userRole={userRole} setUserRole={setUserRole} onStartJudgeDemo={handleStartJudgeDemo} onResetJudgeDemo={handleResetJudgeDemo} onExit={() => go('/')} topics={topics} location={location} copilotContext={copilotContext} copilotOpen={copilotOpen} copilotSeed={copilotSeed} onOpenCopilot={handleOpenCopilot} onCloseCopilot={() => setCopilotOpen(false)} onSeedHandled={() => setCopilotSeed(null)} onRepairCopilot={() => go('/repair')}>
            <AdminDashboard go={go} />
          </Shell>
        </Route>

        <Route path="/courses">
          <Shell mode={mode} setMode={setMode} userRole={userRole} setUserRole={setUserRole} onStartJudgeDemo={handleStartJudgeDemo} onResetJudgeDemo={handleResetJudgeDemo} onExit={() => go('/')} topics={topics} location={location} copilotContext={copilotContext} copilotOpen={copilotOpen} copilotSeed={copilotSeed} onOpenCopilot={handleOpenCopilot} onCloseCopilot={() => setCopilotOpen(false)} onSeedHandled={() => setCopilotSeed(null)} onRepairCopilot={() => go('/repair')}>
            <CourseSelection go={go} />
          </Shell>
        </Route>

        <Route path="/profile">
          <Shell mode={mode} setMode={setMode} userRole={userRole} setUserRole={setUserRole} onStartJudgeDemo={handleStartJudgeDemo} onResetJudgeDemo={handleResetJudgeDemo} onExit={() => go('/')} topics={topics} location={location} copilotContext={copilotContext} copilotOpen={copilotOpen} copilotSeed={copilotSeed} onOpenCopilot={handleOpenCopilot} onCloseCopilot={() => setCopilotOpen(false)} onSeedHandled={() => setCopilotSeed(null)} onRepairCopilot={() => go('/repair')}>
            <ProfilePage profile={profile} setProfile={setProfile} go={go} />
          </Shell>
        </Route>

        <Route path="/competency">
          <Shell mode={mode} setMode={setMode} userRole={userRole} setUserRole={setUserRole} onStartJudgeDemo={handleStartJudgeDemo} onResetJudgeDemo={handleResetJudgeDemo} onExit={() => go('/')} topics={topics} location={location} copilotContext={copilotContext} copilotOpen={copilotOpen} copilotSeed={copilotSeed} onOpenCopilot={handleOpenCopilot} onCloseCopilot={() => setCopilotOpen(false)} onSeedHandled={() => setCopilotSeed(null)} onRepairCopilot={() => go('/repair')}>
            <CompetencyProfilePage profile={profile} setProfile={setProfile} demonstratedCompetencies={demonstratedCompetencies} go={go} />
          </Shell>
        </Route>

        <Route path="/training">
          <Shell mode={mode} setMode={setMode} userRole={userRole} setUserRole={setUserRole} onStartJudgeDemo={handleStartJudgeDemo} onResetJudgeDemo={handleResetJudgeDemo} onExit={() => go('/')} topics={topics} location={location} copilotContext={copilotContext} copilotOpen={copilotOpen} copilotSeed={copilotSeed} onOpenCopilot={handleOpenCopilot} onCloseCopilot={() => setCopilotOpen(false)} onSeedHandled={() => setCopilotSeed(null)} onRepairCopilot={() => go('/repair')}>
            <TrainingRecommendationsPage targetRole={profile.targetRole || 'stat_analyst'} demonstratedCompetencies={demonstratedCompetencies} go={go} />
          </Shell>
        </Route>

        <Route path="/materials">
          <Shell mode={mode} setMode={setMode} userRole={userRole} setUserRole={setUserRole} onStartJudgeDemo={handleStartJudgeDemo} onResetJudgeDemo={handleResetJudgeDemo} onExit={() => go('/')} topics={topics} location={location} copilotContext={copilotContext} copilotOpen={copilotOpen} copilotSeed={copilotSeed} onOpenCopilot={handleOpenCopilot} onCloseCopilot={() => setCopilotOpen(false)} onSeedHandled={() => setCopilotSeed(null)} onRepairCopilot={() => go('/repair')}>
            <MaterialUploadPage onMaterialSelected={setActiveMaterial} go={go} />
          </Shell>
        </Route>

        <Route path="/mcq-generator">
          <Shell mode={mode} setMode={setMode} userRole={userRole} setUserRole={setUserRole} onStartJudgeDemo={handleStartJudgeDemo} onResetJudgeDemo={handleResetJudgeDemo} onExit={() => go('/')} topics={topics} location={location} copilotContext={copilotContext} copilotOpen={copilotOpen} copilotSeed={copilotSeed} onOpenCopilot={handleOpenCopilot} onCloseCopilot={() => setCopilotOpen(false)} onSeedHandled={() => setCopilotSeed(null)} onRepairCopilot={() => go('/repair')}>
            <MCQGeneratorPage material={activeMaterial} onPublishQuestions={setPublishedQuestions} go={go} />
          </Shell>
        </Route>

        <Route path="/assessment">
          <Shell mode={mode} setMode={setMode} userRole={userRole} setUserRole={setUserRole} onStartJudgeDemo={handleStartJudgeDemo} onResetJudgeDemo={handleResetJudgeDemo} onExit={() => go('/')} topics={topics} location={location} copilotContext={copilotContext} copilotOpen={copilotOpen} copilotSeed={copilotSeed} onOpenCopilot={handleOpenCopilot} onCloseCopilot={() => setCopilotOpen(false)} onSeedHandled={() => setCopilotSeed(null)} onRepairCopilot={() => go('/repair')}>
            <AssessmentPage questions={publishedQuestions} demonstratedCompetencies={demonstratedCompetencies} onCompleteAssessment={handleCompleteAssessment} go={go} />
          </Shell>
        </Route>

        <Route path="/diagnostic">
          <Shell mode={mode} setMode={setMode} userRole={userRole} setUserRole={setUserRole} onStartJudgeDemo={handleStartJudgeDemo} onResetJudgeDemo={handleResetJudgeDemo} onExit={() => go('/')} topics={topics} location={location} copilotContext={copilotContext} copilotOpen={copilotOpen} copilotSeed={copilotSeed} onOpenCopilot={handleOpenCopilot} onCloseCopilot={() => setCopilotOpen(false)} onSeedHandled={() => setCopilotSeed(null)} onRepairCopilot={() => go('/repair')}>
            <DiagnosticPage mode={mode} setProgress={setTopics} go={go} />
          </Shell>
        </Route>

        <Route path="/roadmap">
          <Shell mode={mode} setMode={setMode} userRole={userRole} setUserRole={setUserRole} onStartJudgeDemo={handleStartJudgeDemo} onResetJudgeDemo={handleResetJudgeDemo} onExit={() => go('/')} topics={topics} location={location} copilotContext={copilotContext} copilotOpen={copilotOpen} copilotSeed={copilotSeed} onOpenCopilot={handleOpenCopilot} onCloseCopilot={() => setCopilotOpen(false)} onSeedHandled={() => setCopilotSeed(null)} onRepairCopilot={() => go('/repair')}>
            <RoadmapPage topics={topics} mode={mode} go={go} updated={false} />
          </Shell>
        </Route>

        <Route path="/dashboard">
          <Shell mode={mode} setMode={setMode} userRole={userRole} setUserRole={setUserRole} onStartJudgeDemo={handleStartJudgeDemo} onResetJudgeDemo={handleResetJudgeDemo} onExit={() => go('/')} topics={topics} location={location} copilotContext={copilotContext} copilotOpen={copilotOpen} copilotSeed={copilotSeed} onOpenCopilot={handleOpenCopilot} onCloseCopilot={() => setCopilotOpen(false)} onSeedHandled={() => setCopilotSeed(null)} onRepairCopilot={() => go('/repair')}>
            <Dashboard topics={topics} profile={profile} mode={mode} go={go} />
          </Shell>
        </Route>

        <Route path="/learning">
          <Shell mode={mode} setMode={setMode} userRole={userRole} setUserRole={setUserRole} onStartJudgeDemo={handleStartJudgeDemo} onResetJudgeDemo={handleResetJudgeDemo} onExit={() => go('/')} topics={topics} location={location} copilotContext={copilotContext} copilotOpen={copilotOpen} copilotSeed={copilotSeed} onOpenCopilot={handleOpenCopilot} onCloseCopilot={() => setCopilotOpen(false)} onSeedHandled={() => setCopilotSeed(null)} onRepairCopilot={() => go('/repair')}>
            <LearningPage topic={currentTopic} go={go} onOpenCopilot={handleOpenCopilot} />
          </Shell>
        </Route>

        <Route path="/practice">
          <Shell mode={mode} setMode={setMode} userRole={userRole} setUserRole={setUserRole} onStartJudgeDemo={handleStartJudgeDemo} onResetJudgeDemo={handleResetJudgeDemo} onExit={() => go('/')} topics={topics} location={location} copilotContext={copilotContext} copilotOpen={copilotOpen} copilotSeed={copilotSeed} onOpenCopilot={handleOpenCopilot} onCloseCopilot={() => setCopilotOpen(false)} onSeedHandled={() => setCopilotSeed(null)} onRepairCopilot={() => go('/repair')}>
            <PracticePage topic={currentTopic} go={go} setTopics={setTopics} />
          </Shell>
        </Route>

        <Route path="/progress">
          <Shell mode={mode} setMode={setMode} userRole={userRole} setUserRole={setUserRole} onStartJudgeDemo={handleStartJudgeDemo} onResetJudgeDemo={handleResetJudgeDemo} onExit={() => go('/')} topics={topics} location={location} copilotContext={copilotContext} copilotOpen={copilotOpen} copilotSeed={copilotSeed} onOpenCopilot={handleOpenCopilot} onCloseCopilot={() => setCopilotOpen(false)} onSeedHandled={() => setCopilotSeed(null)} onRepairCopilot={() => go('/repair')}>
            <ProgressPage profile={profile} demonstratedCompetencies={demonstratedCompetencies} topics={topics} go={go} />
          </Shell>
        </Route>

        <Route path="/settings">
          <Shell mode={mode} setMode={setMode} userRole={userRole} setUserRole={setUserRole} onStartJudgeDemo={handleStartJudgeDemo} onResetJudgeDemo={handleResetJudgeDemo} onExit={() => go('/')} topics={topics} location={location} copilotContext={copilotContext} copilotOpen={copilotOpen} copilotSeed={copilotSeed} onOpenCopilot={handleOpenCopilot} onCloseCopilot={() => setCopilotOpen(false)} onSeedHandled={() => setCopilotSeed(null)} onRepairCopilot={() => go('/repair')}>
            <SettingsPage onResetDemo={handleResetJudgeDemo} go={go} />
          </Shell>
        </Route>

        <Route path="/class">
          <Shell mode={mode} setMode={setMode} userRole={userRole} setUserRole={setUserRole} onStartJudgeDemo={handleStartJudgeDemo} onResetJudgeDemo={handleResetJudgeDemo} onExit={() => go('/')} topics={topics} location={location} copilotContext={copilotContext} copilotOpen={copilotOpen} copilotSeed={copilotSeed} onOpenCopilot={handleOpenCopilot} onCloseCopilot={() => setCopilotOpen(false)} onSeedHandled={() => setCopilotSeed(null)} onRepairCopilot={() => go('/repair')}>
            <LiveClassSim go={go} />
          </Shell>
        </Route>

        <Route path="/notes">
          <Shell mode={mode} setMode={setMode} userRole={userRole} setUserRole={setUserRole} onStartJudgeDemo={handleStartJudgeDemo} onResetJudgeDemo={handleResetJudgeDemo} onExit={() => go('/')} topics={topics} location={location} copilotContext={copilotContext} copilotOpen={copilotOpen} copilotSeed={copilotSeed} onOpenCopilot={handleOpenCopilot} onCloseCopilot={() => setCopilotOpen(false)} onSeedHandled={() => setCopilotSeed(null)} onRepairCopilot={() => go('/repair')}>
            <ClassNotes go={go} />
          </Shell>
        </Route>

        <Route>
          <Shell mode={mode} setMode={setMode} userRole={userRole} setUserRole={setUserRole} onStartJudgeDemo={handleStartJudgeDemo} onResetJudgeDemo={handleResetJudgeDemo} onExit={() => go('/')} topics={topics} location={location} copilotContext={copilotContext} copilotOpen={copilotOpen} copilotSeed={copilotSeed} onOpenCopilot={handleOpenCopilot} onCloseCopilot={() => setCopilotOpen(false)} onSeedHandled={() => setCopilotSeed(null)} onRepairCopilot={() => go('/repair')}>
            <Dashboard topics={topics} profile={profile} mode={mode} go={go} />
          </Shell>
        </Route>
      </Switch>
    </WouterRouter>
  );
}
