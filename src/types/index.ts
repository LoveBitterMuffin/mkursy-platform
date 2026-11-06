export type SkillCategory = 'algebra' | 'geometry' | 'probability' | 'calculus' | 'olympiad';

export type SkillStatus = 'locked' | 'available' | 'in_progress' | 'mastered';

export type TargetExam = 'oge' | 'ege_profile' | 'olympiad';

export interface SkillNode {
  id: string;
  title: string;
  category: SkillCategory;
  grade: number; // 5..11
  x: number; // Coordinates in galaxy canvas
  y: number;
  prerequisites: string[]; // Parent skill IDs
  status: SkillStatus;
  progress: number; // 0..100
  xpReward: number;
  lessonId: string;
}

export type CalloutType = 'info' | 'theorem' | 'trap' | 'property';

export interface TextLessonBlock {
  id: string;
  type: 'text';
  content: string;
  calloutType?: CalloutType;
}

export interface MathLessonBlock {
  id: string;
  type: 'math';
  latex: string;
  caption?: string;
  explanation?: string;
}

export interface PlotParam {
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
}

export interface PlotLessonBlock {
  id: string;
  type: 'plot';
  title: string;
  fnExpression: string; // e.g. "a * x^2 + b * x + c"
  params: PlotParam[];
}

export interface VideoLessonBlock {
  id: string;
  type: 'video';
  title: string;
  url: string;
  durationMinutes: number;
}

export interface QuizLessonBlock {
  id: string;
  type: 'quiz';
  question: string;
  options: string[];
  correctOptionIndex: number;
  mathAnswer?: string;
  hints: string[];
  explanation: string;
}

export interface PhotoSubmissionBlock {
  id: string;
  type: 'photo_submission';
  prompt: string;
  maxScore: number;
  criteria?: string;
  uploadedPhotoUrl?: string;
}

export type LessonBlock =
  | TextLessonBlock
  | MathLessonBlock
  | PlotLessonBlock
  | VideoLessonBlock
  | QuizLessonBlock
  | PhotoSubmissionBlock;

export interface Lesson {
  id: string;
  skillId: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  blocks: LessonBlock[];
}

export interface StudentProfile {
  name: string;
  grade: number;
  targetExam: TargetExam;
  streakDays: number;
  totalXp: number;
  forecastScore: number;
}

export * from './courses';
export * from './auth';
export * from './payment';
export * from './groups';
export * from './crm';
export * from './homework';
export * from './navigation';
export * from './theme';
