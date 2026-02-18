import { getMilestones, formatDate } from '../utils/milestones';

interface MilestonesSectionProps {
  retirementDate: Date | null;
}

export function MilestonesSection({ retirementDate }: MilestonesSectionProps) {
  if (!retirementDate) {
    return (
      <section className="milestones-section" aria-label="기념일">
        <h2>기념일</h2>
        <p className="milestones-placeholder">은퇴 예정일을 설정하면 기념일이 표시됩니다.</p>
      </section>
    );
  }

  const milestones = getMilestones(retirementDate);
  const today = new Date();

  return (
    <section className="milestones-section" aria-label="기념일">
      <h2>기념일</h2>
      <ul className="milestones-list">
        {milestones.map((m, i) => {
          const daysUntilMilestone = Math.floor(
            (m.date.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)
          );
          return (
            <li
              key={`${m.label}-${i}`}
              className={`milestone-item ${m.isPast ? 'milestone-past' : ''}`}
            >
              <span className="milestone-label">{m.label}</span>
              <span className="milestone-date">{formatDate(m.date)}</span>
              {!m.isPast && daysUntilMilestone >= 0 && (
                <span className="milestone-days">(D-{daysUntilMilestone})</span>
              )}
              {m.isPast && <span className="milestone-badge">지남</span>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
