export type Difficulty = 'easy' | 'medium' | 'hard';
export type Importance = 'important' | 'normal' | 'skip';

export interface Task {
  id: string;
  subject: string;
  description: string;
  difficulty: Difficulty;
  importance: Importance;
  dueDate?: string;
  manualMinutes?: number;
  completed: boolean;
  postponedDate?: string;
  createdAt: string;
  plannerDate?: string;
}

export interface FixedActivity {
  id: string;
  title: string;
  weekday: number;
  start: string;
  end: string;
  type: 'activity' | 'dinner';
}

export interface Routine {
  schoolStart: Record<number, string>;
  schoolEnd: Record<number, string>;
  travelMinutes: number;
  dinnerTime: string;
  dinnerDuration: number;
  bedtime: string;
  wakeTime: string;
  freeTimeMinutes: number;
  notificationsEnabled: boolean;
  notificationLeadMinutes: number;
  activities: FixedActivity[];
}

export interface scheduleTaskBlock {
  id: string;
  taskId: string;
  title: string;
  subject: string;
  difficulty: Difficulty;
  importance: Importance;
  start: number;
  end: number;
  type: 'task';
  description: string;
}

export interface scheduleFreeBlock {
  id: string;
  title: string;
  start: number;
  end: number;
  type: 'break' | 'free' | 'fixed';
}

export type ScheduleBlock = scheduleTaskBlock | scheduleFreeBlock;

export interface ScheduleSummary {
  blocks: ScheduleBlock[];
  warning: boolean;
  unplacedTasks: Task[];
  totalStudyMinutes: number;
  totalBreakMinutes: number;
  totalFreeMinutes: number;
}

export interface DayReport {
  date: string;
  planned: number;
  completed: number;
  subjectBreakdown: Record<string, number>;
  difficultyBreakdown: Record<string, number>;
  studyMinutes: number;
  freeMinutes: number;
  success: boolean;
}

export interface AppData {
  routine: Routine | null;
  tasks: Task[];
  dayReports: Record<string, DayReport>;
  streak: number;
  bestStreak: number;
}

export const weekdayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const difficultyOptions: ReadonlyArray<Difficulty> = ['easy', 'medium', 'hard'];
export const importanceOptions: ReadonlyArray<Importance> = ['important', 'normal', 'skip'];

export const quickSubjects = [
  'Математика',
  'Русский',
  'История',
  'Английский',
  'Физика',
  'Литература',
  'Химия',
  'География',
  'Обществознание',
  'Информатика'
];

export const defaultRoutine = (): Routine => ({
  schoolStart: { 0: '08:30', 1: '08:30', 2: '08:30', 3: '08:30', 4: '08:30', 5: '10:00', 6: '10:00' },
  schoolEnd: { 0: '15:00', 1: '15:00', 2: '15:00', 3: '15:00', 4: '15:00', 5: '13:00', 6: '13:00' },
  travelMinutes: 25,
  dinnerTime: '19:30',
  dinnerDuration: 30,
  bedtime: '22:30',
  wakeTime: '07:00',
  freeTimeMinutes: 60,
  notificationsEnabled: false,
  notificationLeadMinutes: 5,
  activities: [
    { id: 'activity-1', title: 'Футбол', weekday: 1, start: '17:30', end: '18:45', type: 'activity' },
    { id: 'activity-2', title: 'Репетитор', weekday: 3, start: '17:00', end: '18:00', type: 'activity' }
  ]
});

export const formatDateKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const getWeekdayIndex = (date: Date): number => (date.getDay() + 6) % 7;

export const parseTimeToMinutes = (value: string): number => {
  const [hours, minutes] = value.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): string => {
  const safe = Math.max(0, minutes);
  const hours = Math.floor(safe / 60) % 24;
  const mins = safe % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

export const getTaskDuration = (task: Task): number => {
  if (task.manualMinutes && task.manualMinutes > 0) return task.manualMinutes;
  if (task.difficulty === 'easy') return 25;
  if (task.difficulty === 'medium') return 40;
  return 70;
};

export const createDemoTasks = (): Task[] => {
  const today = new Date();
  const todayKey = formatDateKey(today);
  return [
    {
      id: 'task-demo-1',
      subject: 'Математика',
      description: '5 номеров по алгебре',
      difficulty: 'hard',
      importance: 'important',
      dueDate: todayKey,
      completed: false,
      createdAt: new Date().toISOString(),
      plannerDate: todayKey
    },
    {
      id: 'task-demo-2',
      subject: 'Русский',
      description: 'Написать изложение',
      difficulty: 'easy',
      importance: 'normal',
      dueDate: todayKey,
      completed: false,
      createdAt: new Date().toISOString(),
      plannerDate: todayKey
    },
    {
      id: 'task-demo-3',
      subject: 'Английский',
      description: 'Выучить 10 новых слов',
      difficulty: 'medium',
      importance: 'normal',
      dueDate: todayKey,
      completed: false,
      createdAt: new Date().toISOString(),
      plannerDate: todayKey
    },
    {
      id: 'task-demo-4',
      subject: 'История',
      description: 'Параграф 12 + вопросы',
      difficulty: 'medium',
      importance: 'important',
      dueDate: todayKey,
      completed: false,
      createdAt: new Date().toISOString(),
      plannerDate: todayKey
    }
  ];
};

export const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export const compareTasks = (a: Task, b: Task): number => {
  const dueOrder = Number(Boolean(a.dueDate)) - Number(Boolean(b.dueDate));
  if (dueOrder !== 0) return dueOrder;
  const importanceWeight = { important: 0, normal: 1, skip: 2 };
  const difficultyWeight = { hard: 0, medium: 1, easy: 2 };
  const byImportance = importanceWeight[a.importance] - importanceWeight[b.importance];
  if (byImportance !== 0) return byImportance;
  const byDifficulty = difficultyWeight[a.difficulty] - difficultyWeight[b.difficulty];
  if (byDifficulty !== 0) return byDifficulty;
  return a.subject.localeCompare(b.subject);
};
