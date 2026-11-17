import { Routine, Task } from './types';

export const weekdayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const difficultyOptions = ['easy', 'medium', 'hard'] as const;
export const importanceOptions = ['important', 'normal', 'skip'] as const;

export const quickSubjects = [
  'Математика',
  'Русский',
  'Английский',
  'Физика',
  'История',
  'Литература',
  'Химия',
  'Обществознание',
  'Информатика',
  'География'
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
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const getWeekdayIndex = (date: Date): number => {
  const value = (date.getDay() + 6) % 7;
  return value;
};

export const getTaskDuration = (task: Task): number => {
  if (task.manualMinutes && task.manualMinutes > 0) return task.manualMinutes;
  if (task.difficulty === 'easy') return 25;
  if (task.difficulty === 'medium') return 40;
  return 70;
};

export const chromeNotificationMessage = (title: string): string => title;

export const createDemoTasks = (): Task[] => {
  const today = new Date();
  const dateKey = formatDateKey(today);
  return [
    {
      id: 'task-demo-1',
      subject: 'Математика',
      description: '5 номеров по алгебре',
      difficulty: 'hard',
      importance: 'important',
      dueDate: dateKey,
      completed: false,
      createdAt: new Date().toISOString(),
      plannerDate: dateKey
    },
    {
      id: 'task-demo-2',
      subject: 'Русский',
      description: 'Написать изложение',
      difficulty: 'easy',
      importance: 'normal',
      dueDate: dateKey,
      completed: false,
      createdAt: new Date().toISOString(),
      plannerDate: dateKey
    },
    {
      id: 'task-demo-3',
      subject: 'Английский',
      description: 'Выучить 10 новых слов',
      difficulty: 'medium',
      importance: 'normal',
      dueDate: dateKey,
      completed: false,
      createdAt: new Date().toISOString(),
      plannerDate: dateKey
    },
    {
      id: 'task-demo-4',
      subject: 'История',
      description: 'Параграф 12 + вопросы',
      difficulty: 'medium',
      importance: 'important',
      dueDate: dateKey,
      completed: false,
      createdAt: new Date().toISOString(),
      plannerDate: dateKey
    }
  ];
};
