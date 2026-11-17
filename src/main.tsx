import {
  AppData,
  DayReport,
  Routine,
  ScheduleBlock,
  ScheduleSummary,
  Task,
  compareTasks,
  formatDateKey,
  getTaskDuration,
  getWeekdayIndex,
  minutesToTime,
  parseTimeToMinutes,
  weekdayNames
} from './demo';

const blockOverlaps = (aStart: number, aEnd: number, bStart: number, bEnd: number): boolean =>
  aStart < bEnd && aEnd > bStart;

const sortByStart = (a: ScheduleBlock, b: ScheduleBlock): number => a.start - b.start;

export const getFixedBlocksForDay = (routine: Routine, now: Date): { start: number; end: number; title: string; type: 'fixed' }[] => {
  const dayIndex = getWeekdayIndex(now);
  const blocks: { start: number; end: number; title: string; type: 'fixed' }[] = [];

  const schoolEnd = parseTimeToMinutes(routine.schoolEnd[dayIndex] || '15:00');
  const schoolStart = parseTimeToMinutes(routine.schoolStart[dayIndex] || '08:30');
  const todayMinutes = now.getHours() * 60 + now.getMinutes();
  const effectiveStart = Math.max(schoolEnd + routine.travelMinutes, todayMinutes);

  if (schoolStart && schoolEnd && schoolEnd > schoolStart) {
    blocks.push({
      start: schoolEnd + routine.travelMinutes,
      end: schoolEnd + routine.travelMinutes + 5,
      title: 'Дорога домой',
      type: 'fixed'
    });
  }

  routine.activities
    .filter((activity) => activity.weekday === dayIndex)
    .forEach((activity) => {
      const start = parseTimeToMinutes(activity.start);
      const end = parseTimeToMinutes(activity.end);
      if (end > start) {
        blocks.push({ start, end, title: activity.title, type: 'fixed' });
      }
    });

  const dinnerStart = parseTimeToMinutes(routine.dinnerTime);
  const dinnerEnd = dinnerStart + routine.dinnerDuration;
  blocks.push({ start: dinnerStart, end: dinnerEnd, title: 'Ужин', type: 'fixed' });

  return blocks.filter((block) => block.start >= effectiveStart || block.end >= effectiveStart);
};

export const compareByUrgency = (a: Task, b: Task): number => {
  const dueA = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
  const dueB = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
  if (dueA !== dueB) return dueA - dueB;

  const importanceRank = { important: 0, normal: 1, skip: 2 };
  const difficultyRank = { hard: 0, medium: 1, easy: 2 };

  const importance = importanceRank[a.importance] - importanceRank[b.importance];
  if (importance !== 0) return importance;

  const difficulty = difficultyRank[a.difficulty] - difficultyRank[b.difficulty];
  if (difficulty !== 0) return difficulty;

  return a.subject.localeCompare(b.subject);
};

export const generateSchedule = (tasks: Task[], routine: Routine, now: Date): ScheduleSummary => {
  const activeTasks = tasks.filter((task) => !task.completed && !task.postponedDate).sort(compareByUrgency);
  const dayIndex = getWeekdayIndex(now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const schoolEnd = parseTimeToMinutes(routine.schoolEnd[dayIndex] || '15:00');
  const schoolTravelStart = schoolEnd + routine.travelMinutes;
  const start = Math.max(currentMinutes, schoolTravelStart);
  const bedtime = parseTimeToMinutes(routine.bedtime);
  const freeTimeStart = Math.max(start, bedtime - routine.freeTimeMinutes);

  const fixedBlocks = getFixedBlocksForDay(routine, now)
    .filter((block) => block.start >= start || block.end >= start)
    .sort((a, b) => a.start - b.start);

  const scheduleBlocks: ScheduleBlock[] = [];
  const unplacedTasks: Task[] = [];
  let cursor = start;
  let breakMinutes = 0;
  let studyMinutes = 0;

  const scheduleTask = (task: Task, taskStart: number) => {
    const taskDuration = getTaskDuration(task);
    const end = taskStart + taskDuration;
    scheduleBlocks.push({
      id: `task-${task.id}`,
      taskId: task.id,
      title: task.subject,
      subject: task.subject,
      description: task.description,
      difficulty: task.difficulty,
      importance: task.importance,
      start: taskStart,
      end,
      type: 'task'
    });
    studyMinutes += taskDuration;
    const breakEnd = end + 10;
    if (breakEnd <= freeTimeStart && activeTasks[activeTasks.length - 1]?.id !== task.id) {
      scheduleBlocks.push({
        id: `break-${task.id}`,
        title: 'Перерыв',
        start: end,
        end: breakEnd,
        type: 'break'
      });
      breakMinutes += 10;
      cursor = breakEnd;
    } else {
      cursor = end;
    }
  };

  for (const task of activeTasks) {
    const taskDuration = getTaskDuration(task);
    let placed = false;
    let current = cursor;

    while (current + taskDuration <= freeTimeStart && !placed) {
      const overlapsFixed = fixedBlocks.some((block) => blockOverlaps(current, current + taskDuration, block.start, block.end));
      if (!overlapsFixed) {
        scheduleTask(task, current);
        placed = true;
      } else {
        const nextFixed = fixedBlocks.find((block) => block.start >= current);
        if (!nextFixed) {
          break;
        }
        current = nextFixed.end;
      }
    }

    if (!placed) {
      unplacedTasks.push(task);
    }
  }

  const freeTimeBlock = {
    id: 'free-block',
    title: 'Свободное время / отдых',
    start: freeTimeStart,
    end: bedtime,
    type: 'free' as const
  };

  if (freeTimeStart < bedtime) {
    scheduleBlocks.push(freeTimeBlock);
  }

  fixedBlocks.forEach((block) => {
    scheduleBlocks.push({
      id: `fixed-${block.title}`,
      title: block.title,
      start: block.start,
      end: block.end,
      type: 'fixed'
    });
  });

  const sortedBlocks = [...scheduleBlocks].sort(sortByStart);
  const totalBreakMinutes = breakMinutes;
  const totalFreeMinutes = freeTimeStart < bedtime ? bedtime - freeTimeStart : 0;

  const warning =
    sortedBlocks.reduce((sum, block) => (block.type === 'task' ? sum + (block.end - block.start) : sum), 0) + totalBreakMinutes + totalFreeMinutes > bedtime - start ||
    studyMinutes > 240 ||
    start + studyMinutes + totalBreakMinutes + totalFreeMinutes > bedtime ||
    activeTasks.length > 7;

  return {
    blocks: sortedBlocks,
    warning,
    unplacedTasks,
    totalStudyMinutes: studyMinutes,
    totalBreakMinutes,
    totalFreeMinutes
  };
};

export const buildWeeklyStats = (tasks: Task[], reports: Record<string, DayReport>, date: Date): Array<{ date: string; value: number; label: string }> => {
  const result: Array<{ date: string; value: number; label: string }> = [];
  for (let i = 6; i >= 0; i -= 1) {
    const current = new Date(date);
    current.setDate(current.getDate() - i);
    const key = formatDateKey(current);
    const report = reports[key];
    const completed = report ? report.completed : 0;
    const planned = report ? report.planned : 0;
    const ratio = planned > 0 ? Math.round((completed / planned) * 100) : 0;
    result.push({
      date: key,
      value: ratio,
      label: weekdayNames[current.getDay() === 0 ? 6 : (current.getDay() - 1)]
    });
  }
  return result;
};

export const summarizeWeeklyReports = (tasks: Task[], reports: Record<string, DayReport>): { overall: number; days: DayReport[]; subjects: Record<string, number>; difficulty: Record<string, number> } => {
  const filtered = Object.values(reports).slice(-7);
  const completedTotal = filtered.reduce((sum, item) => sum + item.completed, 0);
  const plannedTotal = filtered.reduce((sum, item) => sum + item.planned, 0);
  const overall = plannedTotal > 0 ? Math.round((completedTotal / plannedTotal) * 100) : 0;

  const subjectMap: Record<string, number> = {};
  const difficultyMap: Record<string, number> = {};

  tasks.forEach((task) => {
    if (!task.completed) return;
    subjectMap[task.subject] = (subjectMap[task.subject] || 0) + 1;
    difficultyMap[task.difficulty] = (difficultyMap[task.difficulty] || 0) + 1;
  });

  return {
    overall,
    days: filtered,
    subjects: subjectMap,
    difficulty: difficultyMap
  };
};
