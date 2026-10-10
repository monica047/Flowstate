import React from 'react';
import { 
  CheckSquare, 
  Volume2, 
  VolumeX, 
  FileText, 
  Palette, 
  BarChart2, 
  Calendar, 
  Settings, 
  Maximize2, 
  Flame,
  Award,
  LayoutDashboard
} from 'lucide-react';

export default function BottomDock({
  activePage,
  onNavigate,
  streak = 0,
  soundEnabled = true,
  onToggleSound,
  activeDrawer,
  onToggleDrawer,
  onToggleFullscreen,
}) {
  return (
    <footer className="bottom-dock">
      {/* Left Dock Group */}
      <div className="dock-group">
        <button
          type="button"
          className={`dock-btn ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
          title="Focus Dashboard"
          aria-label="Focus Dashboard"
        >
          <LayoutDashboard size={18} />
        </button>

        <button
          type="button"
          className={`dock-btn ${activePage === 'tasks' || activeDrawer === 'tasks' ? 'active' : ''}`}
          onClick={() => {
            if (activePage === 'dashboard') {
              onToggleDrawer('tasks');
            } else {
              onNavigate('tasks');
            }
          }}
          title="Tasks"
          aria-label="Tasks"
        >
          <CheckSquare size={18} />
        </button>

        <button
          type="button"
          className={`dock-btn ${soundEnabled ? '' : 'muted'}`}
          onClick={onToggleSound}
          title={soundEnabled ? "Chime Audio Enabled" : "Audio Muted"}
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        <button
          type="button"
          className={`dock-btn ${activeDrawer === 'notes' ? 'active' : ''}`}
          onClick={() => onToggleDrawer('notes')}
          title="Quick Scratchpad"
          aria-label="Quick Scratchpad"
        >
          <FileText size={18} />
        </button>
      </div>

      {/* Right Dock Group */}
      <div className="dock-group">
        <div
          className="dock-streak-pill"
          title="Current Daily Streak"
          onClick={() => onNavigate('calendar')}
          style={{ cursor: 'pointer' }}
        >
          <Flame size={17} fill="#f4a261" color="#f4a261" />
          <span className="tabular-nums">{streak}</span>
        </div>

        <button
          type="button"
          className={`dock-btn ${activeDrawer === 'themes' ? 'active' : ''}`}
          onClick={() => onToggleDrawer('themes')}
          title="Forest Themes"
          aria-label="Themes"
        >
          <Palette size={18} />
        </button>

        <button
          type="button"
          className={`dock-btn ${activePage === 'statistics' ? 'active' : ''}`}
          onClick={() => onNavigate('statistics')}
          title="Productivity Statistics"
          aria-label="Statistics"
        >
          <BarChart2 size={18} />
        </button>

        <button
          type="button"
          className={`dock-btn ${activePage === 'calendar' ? 'active' : ''}`}
          onClick={() => onNavigate('calendar')}
          title="Streak Calendar"
          aria-label="Streak Calendar"
        >
          <Calendar size={18} />
        </button>

        <button
          type="button"
          className={`dock-btn ${activePage === 'achievements' ? 'active' : ''}`}
          onClick={() => onNavigate('achievements')}
          title="Achievements & Badges"
          aria-label="Achievements"
        >
          <Award size={18} />
        </button>

        <button
          type="button"
          className={`dock-btn ${activePage === 'settings' ? 'active' : ''}`}
          onClick={() => onNavigate('settings')}
          title="Settings"
          aria-label="Settings"
        >
          <Settings size={18} />
        </button>

        <button
          type="button"
          className="dock-btn"
          onClick={onToggleFullscreen}
          title="Toggle Fullscreen"
          aria-label="Toggle Fullscreen"
        >
          <Maximize2 size={17} />
        </button>
      </div>
    </footer>
  );
}
