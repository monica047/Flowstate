import React from 'react';
import { Menu, Flame, Zap, Award } from 'lucide-react';

export default function Header({
  quote,
  streak = 0,
  xp = 0,
  level = 1,
  onOpenMenu,
  onGoDashboard,
  onOpenAchievements,
}) {
  return (
    <header className="app-header">
      {/* Brand & Menu Toggle */}
      <div className="brand-section">
        <button
          type="button"
          className="dock-btn"
          style={{ width: '40px', height: '40px', marginRight: '0.25rem' }}
          onClick={onOpenMenu}
          title="Open Navigation Menu"
          aria-label="Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div
          className="brand-logo"
          onClick={onGoDashboard}
          style={{ cursor: 'pointer' }}
          title="Go to Focus Dashboard"
        >
          <span>flowstate</span>
          <span className="brand-dot" />
        </div>
      </div>

      {/* Inspirational Quote */}
      <div className="header-quote">
        “{quote || "Deep work is the superpower of the 21st century."}”
      </div>

      {/* Top Header Metrics */}
      <div className="header-stats">
        <div className="stat-chip streak" title="Current Daily Streak">
          <Flame size={15} fill="#f4a261" color="#f4a261" />
          <span className="tabular-nums">{streak} {streak === 1 ? 'day' : 'days'}</span>
        </div>
        <div className="stat-chip xp" title="Total Accumulated Focus XP">
          <Zap size={14} fill="#e9c46a" color="#e9c46a" />
          <span className="tabular-nums">{xp} XP</span>
        </div>
        <button 
          type="button" 
          className="stat-chip level" 
          onClick={onOpenAchievements}
          title="Current Focus Level & Milestones"
        >
          <Award size={14} />
          <span>Lvl {level}</span>
        </button>
      </div>
    </header>
  );
}
