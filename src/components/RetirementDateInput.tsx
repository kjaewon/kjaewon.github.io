interface RetirementDateInputProps {
  value: string; // YYYY-MM-DD or ''
  onChange: (value: string) => void;
}

export function RetirementDateInput({ value, onChange }: RetirementDateInputProps) {
  return (
    <div className="retirement-date-input">
      <label htmlFor="retirement-date">은퇴 예정일</label>
      <input
        id="retirement-date"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="은퇴 예정일 선택"
        className="date-input"
      />
    </div>
  );
}
