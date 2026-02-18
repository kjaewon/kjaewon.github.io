import type { RetirementPlan, UserSettings } from './types';

const SETTINGS_KEY = 'retire-age-settings';
const PLANS_KEY = 'retire-age-plans';

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { retirementDate: null };
    const parsed = JSON.parse(raw) as UserSettings;
    return {
      displayName: parsed.displayName ?? null,
      retirementDate: parsed.retirementDate ?? null,
      birthDate: parsed.birthDate ?? null,
    };
  } catch {
    return { retirementDate: null };
  }
}

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadPlans(): RetirementPlan[] {
  try {
    const raw = localStorage.getItem(PLANS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RetirementPlan[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description ?? undefined,
      startDate: p.startDate ?? undefined,
      endDate: p.endDate ?? undefined,
      completed: Boolean(p.completed),
      createdAt: p.createdAt,
      completedAt: p.completedAt,
    }));
  } catch {
    return [];
  }
}

export function savePlans(plans: RetirementPlan[]): void {
  localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
}
