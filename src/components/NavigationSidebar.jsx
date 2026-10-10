import React from 'react';
import { 
  X, 
  CheckSquare, 
  BarChart2, 
  Calendar, 
  Award, 
  Settings, 
  Zap,
  Flame,
  LayoutDashboard
} from 'lucide-react';

export default function NavigationSidebar({
  isOpen,
  onClose,
  activePage,
  onNavigate,
  streak = 0,
  xp = 0,
  level = 1,
  levelInfo,
}) {
  if (!isOpen) return null;

  const navItems = [
    { id: 'dashboard', label: 'Focus Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'statistics', label: 'Statistics', icon: BarChart2 },
    { id: 'calendar', label: 'Streak Calendar', icon: Calendar },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="nav-sidebar-overlay" onClick={onClose}>
      <aside className="nav-sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="nav-sidebar-header">
          <div className="nav-sidebar-brand">
            <span>flowstate</span>
            <span className="brand-dot" />
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose} 
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="nav-items-list" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item-btn ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
              >
                <Icon size={18} className="nav-icon" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="nav-sidebar-footer">
          <div className="nav-level-card">
            <div className="nav-level-header">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Zap size={13} color="#e9c46a" />
                Level {level}
              </span>
              <span className="tabular-nums" style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                {levelInfo?.xpInCurrentLevel || 0} / {levelInfo?.xpForNextLevel || 100} XP
              </span>
            </div>
            <div className="nav-level-bar">
              <div
                className="nav-level-fill"
                style={{ width: `${levelInfo?.progressPercent || 0}%` }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.5rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#f4a261', fontWeight: 600 }}>
              <Flame size={14} fill="#f4a261" color="#f4a261" />
              {streak} day streak
            </span>
            <span className="tabular-nums">{xp} total XP</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
