import type { MilestoneItem } from '../types';

const DAY_MILESTONES = [100, 200, 300];
const YEAR_MILESTONES = [1, 2, 3, 5, 10];

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addYears(date: Date, years: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

export function getMilestones(retirementDate: Date): MilestoneItem[] {
  const today = new Date();
  const items: MilestoneItem[] = [];

  for (const d of DAY_MILESTONES) {
    const milestoneDate = addDays(retirementDate, -d);
    const daysFromRetirement = -d;
    const isPast = milestoneDate < today;
    items.push({
      label: `은퇴 ${d}일 전`,
      date: milestoneDate,
      daysFromRetirement,
      isPast,
    });
  }

  for (const y of YEAR_MILESTONES) {
    const milestoneDate = addYears(retirementDate, -y);
    const isPast = milestoneDate < today;
    items.push({
      label: `은퇴 ${y}년 전`,
      date: milestoneDate,
      daysFromRetirement: -Math.round(y * 365.25),
      isPast,
    });
  }

  // Sort by date ascending (past first, then future)
  items.sort((a, b) => a.date.getTime() - b.date.getTime());
  return items;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
