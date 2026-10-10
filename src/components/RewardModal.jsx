import React from 'react';
import { Trophy, Zap, Clock, Sparkles, Award } from 'lucide-react';

export default function RewardModal({
  isOpen,
  sessionData,
  totalXp,
  levelInfo,
  leveledUp,
  onClose,
}) {
  if (!isOpen || !sessionData) return null;

  const { durationMinutes = 25, xpEarned = 25, mode = 'focus' } = sessionData;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="reward-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="reward-badge-icon">
          {leveledUp ? <Award size={32} /> : <Trophy size={32} />}
        </div>

        {leveledUp && (
          <div className="level-up-banner">
            <Sparkles size={16} />
            <span>LEVEL UP! You are now Level {levelInfo?.level}!</span>
          </div>
        )}

        <h2 className="reward-title">
          {mode === 'focus' ? 'Session Complete' : 'Break Finished'}
        </h2>
        <p className="reward-subtitle">
          {mode === 'focus'
            ? 'Quiet concentration achieved. Rest and recharge.'
            : 'Recharged. Ready for the next focus sprint?'}
        </p>

        <div className="reward-metrics-grid">
          <div className="reward-stat-box">
            <div className="reward-stat-label">Session Duration</div>
            <div className="reward-stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={15} color="#e9c46a" />
              <span>{durationMinutes} mins</span>
            </div>
          </div>

          <div className="reward-stat-box">
            <div className="reward-stat-label">XP Earned</div>
            <div className="reward-stat-value" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#e9c46a' }}>
              <Zap size={15} color="#e9c46a" />
              <span>+{xpEarned} XP</span>
            </div>
          </div>

          <div className="reward-stat-box">
            <div className="reward-stat-label">Total XP</div>
            <div className="reward-stat-value">
              <span className="tabular-nums">{totalXp} XP</span>
            </div>
          </div>

          <div className="reward-stat-box">
            <div className="reward-stat-label">Current Level</div>
            <div className="reward-stat-value" style={{ color: '#e9c46a' }}>
              <span>Level {levelInfo?.level}</span>
            </div>
          </div>
        </div>

        <div className="level-progress-section">
          <div className="level-progress-labels">
            <span>Next Level Progress</span>
            <span className="tabular-nums">
              {levelInfo?.xpInCurrentLevel} / {levelInfo?.xpForNextLevel} XP
            </span>
          </div>
          <div className="level-progress-track">
            <div
              className="level-progress-fill"
              style={{ width: `${levelInfo?.progressPercent || 0}%` }}
            />
          </div>
        </div>

        <button type="button" className="reward-cta-btn" onClick={onClose}>
          Continue Flow
        </button>
      </div>
    </div>
  );
}
