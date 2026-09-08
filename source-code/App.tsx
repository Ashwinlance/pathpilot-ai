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
