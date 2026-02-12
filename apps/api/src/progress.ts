import dayjs from 'dayjs';
import type { Activity } from './types.js';

export const computeProgress = (activities: Activity[]) => {
  const byStep = new Map<number, { done: number; total: number; percent: number }>();

  for (let step = 0; step <= 9; step += 1) {
    const stepItems = activities.filter((a) => a.stepNumber === step && !a.isNotApplicable);
    const done = stepItems.filter((a) => a.status === 'Done').length;
    const total = stepItems.length;
    byStep.set(step, { done, total, percent: total === 0 ? 0 : Math.round((done / total) * 100) });
  }

  const valid = activities.filter((a) => !a.isNotApplicable);
  const done = valid.filter((a) => a.status === 'Done').length;
  const globalPercent = valid.length === 0 ? 0 : Math.round((done / valid.length) * 100);
  const now = dayjs();

  const overdueCount = activities.filter((a) => {
    if (a.isNotApplicable || a.status === 'Done' || !a.dueDate) return false;
    return dayjs(a.dueDate).isBefore(now, 'day');
  }).length;

  const blockedCount = activities.filter((a) => !a.isNotApplicable && a.status === 'Blocked').length;

  return {
    byStep: Object.fromEntries(byStep.entries()),
    globalPercent,
    overdueCount,
    blockedCount
  };
};
