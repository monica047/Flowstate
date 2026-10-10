import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Clock, 
  Calendar as CalendarIcon, 
  CheckCircle2 
} from 'lucide-react';
import { getLocalDateString } from '../utils/streak.js';

export default function CalendarPage({
  sessions = [],
  streak = 0,
  longestStreak = 0,
}) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  // Group focus sessions by local dateKey (YYYY-MM-DD)
  const sessionDataByDate = {};
  sessions
    .filter((s) => s.mode === 'focus')
    .forEach((s) => {
      const d = s.dateKey || getLocalDateString(new Date(s.timestamp));
      if (!sessionDataByDate[d]) {
        sessionDataByDate[d] = {
          count: 0,
          totalMinutes: 0,
        };
      }
      sessionDataByDate[d].count += 1;
      sessionDataByDate[d].totalMinutes += (s.durationMinutes || Math.round((s.durationSeconds || 0) / 60) || 25);
    });

  // Calculate calendar days
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = getLocalDateString(new Date());

  // Week day headers
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days in selected month with activity
  const activeDaysInMonth = Object.keys(sessionDataByDate).filter((k) => {
    const [y, m] = k.split('-').map(Number);
    return y === year && m === month + 1;
  }).length;

  return (
    <div className="calendar-page-container">
      {/* Header Row */}
      <div className="calendar-header-row">
        <div className="calendar-title-group">
          <h1>Streak Calendar</h1>
          <p>Track habit consistency and daily focus activity across the calendar</p>
        </div>

        {/* Month Selector Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={handleCurrentMonth}
            style={{
              padding: '0.4rem 0.85rem',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-xs)',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Today
          </button>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.06)', borderRadius: 'var(--radius-xs)' }}>
            <button
              type="button"
              onClick={handlePrevMonth}
              style={{
                padding: '0.4rem 0.6rem',
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
              }}
              title="Previous Month"
            >
              <ChevronLeft size={18} />
            </button>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, padding: '0 0.5rem', color: '#ffffff', minWidth: '130px', textAlign: 'center' }}>
              {monthNames[month]} {year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              style={{
                padding: '0.4rem 0.6rem',
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
              }}
              title="Next Month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Streak KPI Strip */}
      <div className="streak-kpi-strip">
        <div className="streak-summary-card">
          <Flame size={26} color="#f4a261" />
          <div>
            <div className="streak-card-val" style={{ color: '#f4a261' }}>{streak}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Current Streak Days</div>
          </div>
        </div>

        <div className="streak-summary-card">
          <CalendarIcon size={26} color="#e9c46a" />
          <div>
            <div className="streak-card-val">{longestStreak}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Longest Streak Days</div>
          </div>
        </div>

        <div className="streak-summary-card">
          <CheckCircle2 size={26} color="#52b788" />
          <div>
            <div className="streak-card-val">{activeDaysInMonth}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Active Days in {monthNames[month]}</div>
          </div>
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div
        style={{
          background: 'rgba(10, 18, 14, 0.82)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-sm)',
          padding: '1.5rem',
        }}
      >
        {/* Day Name Headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '0.75rem', textAlign: 'center' }}>
          {weekDays.map((wd) => (
            <div key={wd} style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {wd}
            </div>
          ))}
        </div>

        {/* Days Matrix */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
          {/* Empty spacer cells before day 1 */}
          {Array.from({ length: firstDayOfMonth }, (_, i) => (
            <div key={`empty-${i}`} style={{ minHeight: '74px', opacity: 0.15 }} />
          ))}

          {/* Actual Month Days */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const dayNum = i + 1;
            const dayKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const activity = sessionDataByDate[dayKey];
            const isToday = dayKey === todayKey;
            const hasActivity = Boolean(activity && activity.count > 0);

            return (
              <div
                key={dayKey}
                style={{
                  minHeight: '74px',
                  background: hasActivity
                    ? 'rgba(45, 106, 79, 0.35)'
                    : isToday
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: isToday
                    ? '1px solid #e9c46a'
                    : hasActivity
                    ? '1px solid rgba(82, 183, 136, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.04)',
                  borderRadius: 'var(--radius-xs)',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: isToday || hasActivity ? 700 : 500,
                      color: isToday ? '#e9c46a' : hasActivity ? '#ffffff' : 'var(--color-text-muted)',
                    }}
                  >
                    {dayNum}
                  </span>
                  {hasActivity && (
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '1px',
                        background: '#52b788',
                        boxShadow: '0 0 6px rgba(82, 183, 136, 0.8)',
                      }}
                    />
                  )}
                </div>

                {hasActivity ? (
                  <div style={{ fontSize: '0.72rem', color: '#a8dadc', marginTop: '0.25rem' }}>
                    <div style={{ fontWeight: 600 }}>{activity.totalMinutes}m</div>
                    <div style={{ opacity: 0.75 }}>{activity.count} {activity.count === 1 ? 'session' : 'sessions'}</div>
                  </div>
                ) : (
                  <div style={{ height: '24px' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
