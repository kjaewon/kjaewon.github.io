export interface RetirementPlan {
  id: string;
  title: string;
  description?: string;
  startDate?: string | null; // YYYY-MM-DD
  endDate?: string | null;   // YYYY-MM-DD, 종료 예정일
  completed: boolean;
  createdAt: string;   // ISO date
  completedAt?: string; // ISO date, 실제 완료일
}

export interface UserSettings {
  displayName?: string | null;
  retirementDate: string | null; // YYYY-MM-DD
  birthDate?: string | null;
}

export interface MilestoneItem {
  label: string;
  date: Date;
  daysFromRetirement: number;
  isPast: boolean;
}
