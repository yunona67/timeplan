export interface Task {
  id: string;
  subject: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  importance: 'important' | 'normal' | 'skip';
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
