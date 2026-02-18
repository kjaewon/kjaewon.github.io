/**
 * Returns remaining days from today to target (target is end of day).
 * Positive = future, 0 = today, negative = past.
 */
export function getRemainingDays(targetDate: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  return Math.floor((target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
}

export interface RemainingYMD {
  years: number;
  months: number;
  days: number;
}

/**
 * Compute remaining years, months, days from today to target.
 * Does not count full calendar months/years; uses day difference and approximates.
 */
export function getRemainingYMD(targetDate: Date): RemainingYMD {
  const today = new Date();
  const target = new Date(targetDate);

  let years = target.getFullYear() - today.getFullYear();
  let months = target.getMonth() - today.getMonth();
  let days = target.getDate() - today.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years: Math.max(0, years), months: Math.max(0, months), days: Math.max(0, days) };
}

export type CountdownMessage = 'future' | 'today' | 'past';

export function getCountdownMessage(remainingDays: number): CountdownMessage {
  if (remainingDays > 0) return 'future';
  if (remainingDays === 0) return 'today';
  return 'past';
}
