import React from 'react';
import { X, Trees } from 'lucide-react';

export default function QuickThemesDrawer({ currentTheme, onSelectTheme, onClose }) {
  const themes = [
    {
      id: 'theme-forest',
      name: 'Toto Ancient Forest',
      subtitle: 'Sunlit canopy & mossy oaks',
      bgStyle: 'linear-gradient(135deg, #1b4332, #2d6a4f, #081c15)',
    },
    {
      id: 'theme-mist',
      name: 'Misty Pine Woods',
      subtitle: 'Quiet dawn mist through pines',
      bgStyle: 'linear-gradient(135deg, #2b3a32, #1c2e24, #0b1410)',
    },
    {
      id: 'theme-dusk',
      name: 'Golden Hour Canopy',
      subtitle: 'Warm sunset rays in the glade',
      bgStyle: 'linear-gradient(135deg, #3d2c1d, #2b2118, #110d0a)',
    },
    {
      id: 'theme-deepwoods',
      name: 'Midnight Woodland',
      subtitle: 'Minimal dark evergreen sanctuary',
      bgStyle: 'linear-gradient(180deg, #0e2017, #08130d, #030705)',
    },
  ];

  return (
    <div className="quick-panel themes-panel">
      <div className="quick-panel-header">
        <div className="quick-panel-title">
          <Trees size={16} />
          <span>Forest Atmosphere</span>
        </div>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
      </div>

      <div className="quick-panel-body">
        <div className="theme-grid">
          {themes.map((t) => (
            <div
              key={t.id}
              className={`theme-card-thumb ${currentTheme === t.id ? 'active' : ''}`}
              onClick={() => onSelectTheme(t.id)}
            >
              <div
                className="theme-thumb-preview"
                style={{ background: t.bgStyle }}
              />
              <div>
                <div className="theme-thumb-title">{t.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{t.subtitle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
