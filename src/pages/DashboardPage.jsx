import React from 'react';
import FocusTimer from '../components/FocusTimer.jsx';
import { Clock, CheckCircle2 } from 'lucide-react';

export default function DashboardPage({
  timeLeft,
  isRunning,
  mode,
  cycleCount,
  activeTask,
  onToggleTimer,
  onResetTimer,
  onSkipTimer,
  onSelectMode,
  onOpenTasksModal,
  streak,
  xp,
  level,
  levelInfo,
  todaySessionsCount,
  todayFocusMinutes,
  onNavigateToTasks,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Centered Pomodoro Clock */}
      <FocusTimer
        timeLeft={timeLeft}
        isRunning={isRunning}
        mode={mode}
        cycleCount={cycleCount}
        activeTask={activeTask}
        onToggleTimer={onToggleTimer}
        onResetTimer={onResetTimer}
        onSkipTimer={onSkipTimer}
        onSelectMode={onSelectMode}
        onOpenTasksModal={onOpenTasksModal}
        streak={streak}
        xp={xp}
        level={level}
      />

      {/* Quiet Minimal Session Summary */}
      <div
        style={{
          marginTop: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          fontSize: '0.86rem',
          color: 'rgba(255, 255, 255, 0.7)',
          letterSpacing: '0.02em',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Clock size={14} color="#e9c46a" />
          <span>{todayFocusMinutes}m focused today</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle2 size={14} color="#52b788" />
          <span>{todaySessionsCount} {todaySessionsCount === 1 ? 'session' : 'sessions'} completed</span>
        </span>
      </div>
    </div>
  );
}
