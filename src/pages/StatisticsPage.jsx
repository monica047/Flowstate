import React, { useState } from 'react';
import { 
  Flame, 
  Clock, 
  Zap, 
  CheckSquare, 
  Calendar, 
  Coffee, 
  TrendingUp, 
  Award 
} from 'lucide-react';
import { getLocalDateString } from '../utils/streak.js';

export default function StatisticsPage({
  sessions = [],
  streak = 0,
  longestStreak = 0,
  totalXp = 0,
  tasks = [],
  onNavigate,
}) {
  const [timeFilter, setTimeFilter] = useState('all'); // 'today' | 'week' | 'month' | 'all'

  const now = new Date();
  const todayKey = getLocalDateString(now);

  const filteredSessions = sessions.filter((s) => {
    if (timeFilter === 'all') return true;
    const sessionDate = new Date(s.timestamp || Date.now());
    if (timeFilter === 'today') {
      const sKey = s.dateKey || getLocalDateString(sessionDate);
      return sKey === todayKey;
    }
    if (timeFilter === 'week') {
      const diffDays = (now - sessionDate) / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    }
    if (timeFilter === 'month') {
      const diffDays = (now - sessionDate) / (1000 * 60 * 60 * 24);
      return diffDays <= 30;
    }
    return true;
  });

  const focusSessions = filteredSessions.filter((s) => s.mode === 'focus');
  const breakSessions = filteredSessions.filter((s) => s.mode === 'shortBreak' || s.mode === 'longBreak');

  const totalFocusMinutes = focusSessions.reduce(
    (acc, s) => acc + (s.durationMinutes || Math.round((s.durationSeconds || 0) / 60) || 25),
    0
  );
  const totalBreakMinutes = breakSessions.reduce(
    (acc, s) => acc + (s.durationMinutes || Math.round((s.durationSeconds || 0) / 60) || 5),
    0
  );

  const formatHoursMins = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
  };

  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const filteredXp = focusSessions.reduce((acc, s) => acc + (s.xpEarned || 25), 0);

  // Daily activity map for the last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = getLocalDateString(d);
    const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
    const dayMinutes = sessions
      .filter((s) => s.mode === 'focus' && (s.dateKey || getLocalDateString(new Date(s.timestamp))) === key)
      .reduce((acc, s) => acc + (s.durationMinutes || 25), 0);
    return { key, dayName, minutes: dayMinutes };
  });

  const maxDayMinutes = Math.max(1, ...last7Days.map((d) => d.minutes));

  return (
    <div className="stats-container">
      {/* Header Row */}
      <div className="stats-header-row">
        <div className="stats-title-group">
          <h1>Productivity Statistics</h1>
          <p>Verified focus analytics computed from your authentic sessions</p>
        </div>

        <div className="time-filter-strip">
          <button
            type="button"
            className={`time-filter-pill ${timeFilter === 'today' ? 'active' : ''}`}
            onClick={() => setTimeFilter('today')}
          >
            Today
          </button>
          <button
            type="button"
            className={`time-filter-pill ${timeFilter === 'week' ? 'active' : ''}`}
            onClick={() => setTimeFilter('week')}
          >
            7 Days
          </button>
          <button
            type="button"
            className={`time-filter-pill ${timeFilter === 'month' ? 'active' : ''}`}
            onClick={() => setTimeFilter('month')}
          >
            30 Days
          </button>
          <button
            type="button"
            className={`time-filter-pill ${timeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setTimeFilter('all')}
          >
            All Time
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="flocus-kpi-grid">
        {/* Streak Card */}
        <div className="flocus-big-card streak">
          <div className="card-top-row">
            <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>Current Streak</span>
            <Flame size={20} />
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1 }}>
              {streak} <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>days</span>
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '0.35rem' }}>
              Longest recorded: {longestStreak} days
            </div>
          </div>
        </div>

        {/* Focus Time Card */}
        <div className="flocus-big-card focustime">
          <div className="card-top-row">
            <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>Deep Focus Time</span>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1 }}>
              {formatHoursMins(totalFocusMinutes)}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '0.35rem' }}>
              {focusSessions.length} total sessions
            </div>
          </div>
        </div>

        {/* Total XP Card */}
        <div className="flocus-big-card xp">
          <div className="card-top-row">
            <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>XP Earned</span>
            <Zap size={20} />
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1 }}>
              {timeFilter === 'all' ? totalXp : filteredXp}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '0.35rem' }}>
              Proportional to completed minutes
            </div>
          </div>
        </div>

        {/* Tasks Completed Card */}
        <div className="flocus-big-card tasks">
          <div className="card-top-row">
            <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>Tasks Completed</span>
            <CheckSquare size={20} />
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1 }}>
              {completedTasksCount}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '0.35rem' }}>
              {tasks.length} total managed tasks
            </div>
          </div>
        </div>

        {/* Sessions Count Card */}
        <div className="flocus-big-card sessions">
          <div className="card-top-row">
            <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>Focus Sessions</span>
            <TrendingUp size={20} />
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1 }}>
              {focusSessions.length}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '0.35rem' }}>
              {totalFocusMinutes > 0 ? `${Math.round(totalFocusMinutes / Math.max(1, focusSessions.length))}m avg duration` : 'No sessions yet'}
            </div>
          </div>
        </div>

        {/* Rest & Recovery Card */}
        <div className="flocus-big-card breaks">
          <div className="card-top-row">
            <span style={{ fontSize: '0.85rem', fontWeight: 600, opacity: 0.9 }}>Mindful Recovery</span>
            <Coffee size={20} />
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1 }}>
              {formatHoursMins(totalBreakMinutes)}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '0.35rem' }}>
              {breakSessions.length} break intervals taken
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Activity Chart */}
      <div
        style={{
          background: 'rgba(10, 18, 14, 0.78)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-sm)',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Daily Focus Activity (Last 7 Days)</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>Minutes focused per calendar day</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', gap: '0.75rem', paddingTop: '1rem' }}>
          {last7Days.map((d) => {
            const heightPercent = Math.max(8, Math.round((d.minutes / maxDayMinutes) * 100));
            return (
              <div
                key={d.key}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  height: '100%',
                  justifyContent: 'flex-end',
                }}
              >
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                  {d.minutes > 0 ? `${d.minutes}m` : ''}
                </span>
                <div
                  style={{
                    width: '100%',
                    maxWidth: '48px',
                    height: `${heightPercent}%`,
                    background: d.minutes > 0 ? 'linear-gradient(180deg, #52b788 0%, #2d6a4f 100%)' : 'rgba(255, 255, 255, 0.06)',
                    borderRadius: 'var(--radius-xs)',
                    transition: 'height 0.3s ease',
                  }}
                  title={`${d.dayName}: ${d.minutes} minutes`}
                />
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: d.key === todayKey ? '#e9c46a' : 'var(--color-text-secondary)' }}>
                  {d.dayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
