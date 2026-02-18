import { useState, useEffect, useCallback } from 'react';
import { loadSettings, saveSettings, loadPlans, savePlans } from './storage';
import type { RetirementPlan, UserSettings } from './types';
import { RetirementDateInput } from './components/RetirementDateInput';
import { CountdownSection } from './components/CountdownSection';
import { MilestonesSection } from './components/MilestonesSection';
import { PlanList } from './components/PlanList';
import './App.css';

function parseRetirementDate(value: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function App() {
  const [settings, setSettings] = useState<UserSettings>(() => loadSettings());
  const [plans, setPlans] = useState<RetirementPlan[]>(() => loadPlans());

  const retirementDate = parseRetirementDate(settings.retirementDate);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    savePlans(plans);
  }, [plans]);

  const handleRetirementDateChange = useCallback((value: string) => {
    setSettings((prev) => ({ ...prev, retirementDate: value || null }));
  }, []);

  const handleDisplayNameChange = useCallback((value: string) => {
    setSettings((prev) => ({ ...prev, displayName: value.trim() || null }));
  }, []);

  const handlePlansChange = useCallback((newPlans: RetirementPlan[]) => {
    setPlans(newPlans);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>은퇴 카운트다운</h1>
        <div className="header-settings">
          <div className="setting-row">
            <label htmlFor="display-name">사용자 이름</label>
            <input
              id="display-name"
              type="text"
              value={settings.displayName ?? ''}
              onChange={(e) => handleDisplayNameChange(e.target.value)}
              placeholder="이름 (선택)"
              className="display-name-input"
              aria-label="사용자 이름"
            />
          </div>
          <RetirementDateInput
            value={settings.retirementDate ?? ''}
            onChange={handleRetirementDateChange}
          />
        </div>
      </header>
      <main className="app-main">
        <CountdownSection retirementDate={retirementDate} />
        <MilestonesSection retirementDate={retirementDate} />
        <PlanList plans={plans} onPlansChange={handlePlansChange} />
      </main>
    </div>
  );
}

export default App;
