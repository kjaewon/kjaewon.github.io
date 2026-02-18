import { getRemainingDays, getRemainingYMD, getCountdownMessage } from '../utils/countdown';

interface CountdownSectionProps {
  retirementDate: Date | null;
}

export function CountdownSection({ retirementDate }: CountdownSectionProps) {
  if (!retirementDate) {
    return (
      <section className="countdown-section" aria-label="은퇴까지 남은 기간">
        <p className="countdown-placeholder">은퇴 예정일을 설정하면 남은 기간이 표시됩니다.</p>
      </section>
    );
  }

  const remainingDays = getRemainingDays(retirementDate);
  const ymd = getRemainingYMD(retirementDate);
  const messageType = getCountdownMessage(remainingDays);

  if (messageType === 'past') {
    return (
      <section className="countdown-section countdown-past" aria-label="은퇴까지 남은 기간">
        <p className="countdown-message">이미 은퇴일이 지났습니다.</p>
        <p className="countdown-sub">축하드립니다!</p>
      </section>
    );
  }

  if (messageType === 'today') {
    return (
      <section className="countdown-section countdown-today" aria-label="은퇴까지 남은 기간">
        <p className="countdown-message">오늘 은퇴일입니다.</p>
        <p className="countdown-sub">축하드립니다!</p>
      </section>
    );
  }

  return (
    <section className="countdown-section" aria-label="은퇴까지 남은 기간">
      <div className="countdown-d-day" aria-live="polite">
        D-{remainingDays}
      </div>
      <p className="countdown-ymd">
        {ymd.years}년 {ymd.months}개월 {ymd.days}일
      </p>
    </section>
  );
}
