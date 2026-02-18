import { useState, useCallback } from 'react';
import type { RetirementPlan } from '../types';

interface PlanListProps {
  plans: RetirementPlan[];
  onPlansChange: (plans: RetirementPlan[]) => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatDateDisplay(value: string | null | undefined): string {
  if (!value) return '';
  const d = new Date(value + 'T00:00:00');
  return isNaN(d.getTime()) ? '' : d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function PlanList({ plans, onPlansChange }: PlanListProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');

  const addPlan = useCallback(() => {
    const title = newTitle.trim();
    if (!title) return;
    const plan: RetirementPlan = {
      id: generateId(),
      title,
      description: newDescription.trim() || undefined,
      startDate: newStartDate || undefined,
      endDate: newEndDate || undefined,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    onPlansChange([...plans, plan]);
    setNewTitle('');
    setNewDescription('');
    setNewStartDate('');
    setNewEndDate('');
  }, [newTitle, newDescription, newStartDate, newEndDate, plans, onPlansChange]);

  const toggleComplete = useCallback(
    (id: string) => {
      onPlansChange(
        plans.map((p) =>
          p.id === id
            ? {
                ...p,
                completed: !p.completed,
                completedAt: !p.completed ? new Date().toISOString() : undefined,
              }
            : p
        )
      );
    },
    [plans, onPlansChange]
  );

  const deletePlan = useCallback(
    (id: string) => {
      onPlansChange(plans.filter((p) => p.id !== id));
      if (editingId === id) {
        setEditingId(null);
        setEditTitle('');
        setEditDescription('');
        setEditStartDate('');
        setEditEndDate('');
      }
    },
    [plans, onPlansChange, editingId]
  );

  const startEdit = useCallback((plan: RetirementPlan) => {
    setEditingId(plan.id);
    setEditTitle(plan.title);
    setEditDescription(plan.description ?? '');
    setEditStartDate(plan.startDate ?? '');
    setEditEndDate(plan.endDate ?? '');
  }, []);

  const saveEdit = useCallback(() => {
    if (editingId == null) return;
    const title = editTitle.trim();
    if (title) {
      onPlansChange(
        plans.map((p) =>
          p.id === editingId
            ? {
                ...p,
                title,
                description: editDescription.trim() || undefined,
                startDate: editStartDate || undefined,
                endDate: editEndDate || undefined,
              }
            : p
        )
      );
    }
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
    setEditStartDate('');
    setEditEndDate('');
  }, [editingId, editTitle, editDescription, editStartDate, editEndDate, plans, onPlansChange]);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
    setEditStartDate('');
    setEditEndDate('');
  }, []);

  return (
    <section className="plans-section" aria-label="은퇴 준비 계획">
      <h2>은퇴 준비 계획</h2>
      <div className="plan-add-form">
        <div className="plan-input-row">
          <label htmlFor="new-plan-title" className="visually-hidden">
            새 계획 제목
          </label>
          <input
            id="new-plan-title"
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
            placeholder="제목"
            className="plan-input"
            aria-label="새 계획 제목"
          />
          <button type="button" onClick={addPlan} className="btn btn-primary">
            계획 추가
          </button>
        </div>
        <div className="plan-add-details">
          <label htmlFor="new-plan-description" className="visually-hidden">
            세부 내용
          </label>
          <textarea
            id="new-plan-description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="세부 내용 (선택)"
            className="plan-description-input"
            rows={2}
            aria-label="세부 내용"
          />
          <div className="plan-date-row">
            <label htmlFor="new-plan-start">시작일</label>
            <input
              id="new-plan-start"
              type="date"
              value={newStartDate}
              onChange={(e) => setNewStartDate(e.target.value)}
              className="plan-date-input"
              aria-label="시작일"
            />
            <label htmlFor="new-plan-end">종료 예정일</label>
            <input
              id="new-plan-end"
              type="date"
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
              className="plan-date-input"
              aria-label="종료 예정일"
            />
          </div>
        </div>
      </div>
      <ul className="plans-list">
        {plans.length === 0 && (
          <li className="plans-empty">아직 추가된 계획이 없습니다.</li>
        )}
        {plans.map((plan) => (
          <li
            key={plan.id}
            className={`plan-item ${plan.completed ? 'plan-item-completed' : ''}`}
          >
            {editingId === plan.id ? (
              <div className="plan-edit-form">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  className="plan-edit-input"
                  placeholder="제목"
                  aria-label="계획 제목 수정"
                  autoFocus
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="plan-description-input"
                  placeholder="세부 내용"
                  rows={2}
                  aria-label="세부 내용 수정"
                />
                <div className="plan-date-row">
                  <input
                    type="date"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                    className="plan-date-input"
                    aria-label="시작일"
                  />
                  <input
                    type="date"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    className="plan-date-input"
                    aria-label="종료 예정일"
                  />
                </div>
                <div className="plan-edit-actions">
                  <button type="button" onClick={saveEdit} className="btn btn-small">
                    저장
                  </button>
                  <button type="button" onClick={cancelEdit} className="btn btn-small">
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <>
                <input
                  type="checkbox"
                  id={`plan-${plan.id}`}
                  checked={plan.completed}
                  onChange={() => toggleComplete(plan.id)}
                  aria-label={`${plan.title} 완료 여부`}
                  className="plan-checkbox"
                />
                <div className="plan-item-body">
                  <label htmlFor={`plan-${plan.id}`} className="plan-title">
                    {plan.title}
                  </label>
                  {plan.description && (
                    <p className="plan-description">{plan.description}</p>
                  )}
                  <div className="plan-item-meta">
                    {plan.startDate && (
                      <span className="plan-meta-date">시작: {formatDateDisplay(plan.startDate)}</span>
                    )}
                    {plan.endDate && (
                      <span className="plan-meta-date">종료 예정: {formatDateDisplay(plan.endDate)}</span>
                    )}
                    {plan.completed && plan.completedAt && (
                      <span className="plan-meta-date">완료: {formatDateDisplay(plan.completedAt.slice(0, 10))}</span>
                    )}
                  </div>
                </div>
                <div className="plan-item-actions">
                  <button
                    type="button"
                    onClick={() => startEdit(plan)}
                    className="btn btn-small"
                    aria-label={`${plan.title} 수정`}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePlan(plan.id)}
                    className="btn btn-small btn-danger"
                    aria-label={`${plan.title} 삭제`}
                  >
                    삭제
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
