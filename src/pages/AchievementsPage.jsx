import React from 'react';
import { 
  Flame, 
  Zap, 
  Clock, 
  Calendar, 
  Award, 
  Trophy, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';
import { ACHIEVEMENTS_LIST } from '../utils/storage.js';

const ICON_MAP = {
  Flame,
  Zap,
  Clock,
  Calendar,
  Award,
  Trophy,
};

export default function AchievementsPage({
  achievements = {},
  sessions = [],
  streakData = { currentStreak: 0, longestStreak: 0 },
}) {
  const unlockedCount = Object.values(achievements).filter((a) => a.unlocked).length;
  const totalCount = ACHIEVEMENTS_LIST.length;
  const progressPercent = Math.round((unlockedCount / Math.max(1, totalCount)) * 100);

  return (
    <div className="achievements-container">
      {/* Header Row */}
      <div className="achievements-header-row">
        <div className="achievements-title-group">
          <h1>Milestones & Achievements</h1>
          <p>Earn badges by maintaining consistent focus habits and hitting milestones</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
              {unlockedCount} of {totalCount} Unlocked
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              {progressPercent}% Complete
            </div>
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-xs)',
              background: 'rgba(233, 196, 106, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#e9c46a',
            }}
          >
            <Trophy size={22} />
          </div>
        </div>
      </div>

      {/* Grid of Achievement Cards */}
      <div className="achievements-grid">
        {ACHIEVEMENTS_LIST.map((ach) => {
          const isUnlocked = Boolean(achievements[ach.id]?.unlocked);
          const unlockedAt = achievements[ach.id]?.unlockedAt;
          const IconComponent = ICON_MAP[ach.iconName] || Award;
          const currentProgress = ach.progress ? ach.progress(sessions, streakData) : (isUnlocked ? ach.target : 0);
          const percent = Math.min(100, Math.round((currentProgress / ach.target) * 100));

          const formattedDate = unlockedAt
            ? new Date(unlockedAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : null;

          return (
            <div
              key={ach.id}
              className={`achievement-card ${isUnlocked ? 'unlocked' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: 'var(--radius-xs)',
                    background: isUnlocked
                      ? 'linear-gradient(135deg, rgba(233, 196, 106, 0.25) 0%, rgba(82, 183, 136, 0.25) 100%)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: isUnlocked
                      ? '1px solid rgba(233, 196, 106, 0.4)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isUnlocked ? '#e9c46a' : 'var(--color-text-muted)',
                    flexShrink: 0,
                  }}
                >
                  <IconComponent size={22} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                      {ach.title}
                    </h3>
                    {isUnlocked ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#52b788', fontSize: '0.75rem', fontWeight: 600 }}>
                        <CheckCircle2 size={13} />
                        Unlocked
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                        <Lock size={12} />
                        Locked
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                    {ach.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar & Footer */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
                  <span>Progress</span>
                  <span className="tabular-nums">
                    {currentProgress} / {ach.target}
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '5px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-xs)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: isUnlocked
                        ? 'linear-gradient(90deg, #52b788 0%, #e9c46a 100%)'
                        : 'rgba(255, 255, 255, 0.25)',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
                {isUnlocked && formattedDate && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', textAlign: 'right' }}>
                    Achieved {formattedDate}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
