import React, { useState } from 'react';
import { 
  Clock, 
  Volume2, 
  Bell, 
  RotateCcw, 
  Palette, 
  Sliders, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { requestNotificationPermission } from '../utils/notifications.js';

export default function SettingsPage({
  settings,
  onUpdateSettings,
  onResetAllData,
  onOpenConfirmModal,
}) {
  const [formValues, setFormValues] = useState({
    focusDuration: settings.focusDuration || 25,
    shortBreakDuration: settings.shortBreakDuration || 5,
    longBreakDuration: settings.longBreakDuration || 15,
    longBreakInterval: settings.longBreakInterval || 4,
    autoStartBreaks: Boolean(settings.autoStartBreaks),
    autoStartFocus: Boolean(settings.autoStartFocus),
    soundEnabled: settings.soundEnabled !== false,
    volume: settings.volume ?? 0.7,
    notificationsEnabled: Boolean(settings.notificationsEnabled),
    theme: settings.theme || 'theme-forest',
    reducedMotion: Boolean(settings.reducedMotion),
  });

  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleChange = (key, value) => {
    const updated = { ...formValues, [key]: value };
    setFormValues(updated);
    onUpdateSettings(updated);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const handleNotificationToggle = async () => {
    if (!formValues.notificationsEnabled) {
      const perm = await requestNotificationPermission();
      if (perm === 'granted') {
        handleChange('notificationsEnabled', true);
      } else {
        alert('Notification permission was not granted by your browser.');
      }
    } else {
      handleChange('notificationsEnabled', false);
    }
  };

  const handleResetClick = () => {
    onOpenConfirmModal({
      title: 'Reset All Progress?',
      message: 'This will reset your focus sessions, streaks, XP, level, and task history. This action cannot be undone.',
      confirmLabel: 'Reset Everything',
      isDanger: true,
      onConfirm: () => {
        onResetAllData();
      },
    });
  };

  return (
    <div className="settings-container">
      {/* Header Row */}
      <div className="settings-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Preferences & Settings</h1>
          <p>Configure durations, ambient soundscapes, notifications, and forest themes</p>
        </div>
        {savedFeedback && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#52b788', fontSize: '0.82rem', fontWeight: 600 }}>
            <Check size={16} /> Saved
          </span>
        )}
      </div>

      {/* Timer Durations Section */}
      <div className="settings-section-card">
        <h2 className="settings-section-title">
          <Clock size={18} color="#e9c46a" />
          <span>Timer Intervals (Minutes)</span>
        </h2>
        <div className="duration-inputs-grid">
          <div className="duration-field">
            <label htmlFor="focusDuration">Focus Duration</label>
            <input
              id="focusDuration"
              type="number"
              min="1"
              max="120"
              value={formValues.focusDuration}
              onChange={(e) => handleChange('focusDuration', Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>

          <div className="duration-field">
            <label htmlFor="shortBreakDuration">Short Break</label>
            <input
              id="shortBreakDuration"
              type="number"
              min="1"
              max="60"
              value={formValues.shortBreakDuration}
              onChange={(e) => handleChange('shortBreakDuration', Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>

          <div className="duration-field">
            <label htmlFor="longBreakDuration">Long Break</label>
            <input
              id="longBreakDuration"
              type="number"
              min="1"
              max="90"
              value={formValues.longBreakDuration}
              onChange={(e) => handleChange('longBreakDuration', Math.max(1, parseInt(e.target.value) || 1))}
            />
          </div>

          <div className="duration-field">
            <label htmlFor="longBreakInterval">Long Break Every</label>
            <input
              id="longBreakInterval"
              type="number"
              min="1"
              max="12"
              value={formValues.longBreakInterval}
              onChange={(e) => handleChange('longBreakInterval', Math.max(1, parseInt(e.target.value) || 1))}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>focus sessions</span>
          </div>
        </div>
      </div>

      {/* Automation Section */}
      <div className="settings-section-card">
        <h2 className="settings-section-title">
          <Sliders size={18} color="#a8dadc" />
          <span>Automation</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>Auto-start Breaks</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Automatically begin break count when focus ends</div>
            </div>
            <input
              type="checkbox"
              checked={formValues.autoStartBreaks}
              onChange={(e) => handleChange('autoStartBreaks', e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#e9c46a', cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>Auto-start Focus Sessions</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Automatically begin focus session when break concludes</div>
            </div>
            <input
              type="checkbox"
              checked={formValues.autoStartFocus}
              onChange={(e) => handleChange('autoStartFocus', e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#e9c46a', cursor: 'pointer' }}
            />
          </label>
        </div>
      </div>

      {/* Audio & Alerts Section */}
      <div className="settings-section-card">
        <h2 className="settings-section-title">
          <Volume2 size={18} color="#52b788" />
          <span>Audio & Soundscapes</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>Synthesized Bell Chime</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Warm ambient harmonic chime upon session completion</div>
            </div>
            <input
              type="checkbox"
              checked={formValues.soundEnabled}
              onChange={(e) => handleChange('soundEnabled', e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#e9c46a', cursor: 'pointer' }}
            />
          </label>

          {formValues.soundEnabled && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Master Volume</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '200px' }}>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={formValues.volume}
                  onChange={(e) => handleChange('volume', parseFloat(e.target.value))}
                  style={{ flex: 1, accentColor: '#e9c46a' }}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', minWidth: '35px', textAlign: 'right' }}>
                  {Math.round(formValues.volume * 100)}%
                </span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff' }}>System Notifications</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Send desktop alert when timer finishes</div>
            </div>
            <button
              type="button"
              onClick={handleNotificationToggle}
              style={{
                padding: '0.4rem 0.85rem',
                background: formValues.notificationsEnabled ? 'rgba(82, 183, 136, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                border: formValues.notificationsEnabled ? '1px solid #52b788' : '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--radius-xs)',
                color: formValues.notificationsEnabled ? '#52b788' : '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {formValues.notificationsEnabled ? 'Enabled' : 'Enable Notifications'}
            </button>
          </div>
        </div>
      </div>

      {/* Forest Theme Section */}
      <div className="settings-section-card">
        <h2 className="settings-section-title">
          <Palette size={18} color="#f4a261" />
          <span>Forest Aesthetic Ambience</span>
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
          {[
            { id: 'theme-forest', name: 'Pine Canopy', desc: 'Lush natural forest backdrop' },
            { id: 'theme-mist', name: 'Misty Timber', desc: 'Overcast, calm morning fog' },
            { id: 'theme-dusk', name: 'Dusk Woodlands', desc: 'Warm sunset pine rays' },
            { id: 'theme-deepwoods', name: 'Deep Evergreen', desc: 'Distraction-free dark spruce' },
          ].map((th) => (
            <button
              key={th.id}
              type="button"
              onClick={() => handleChange('theme', th.id)}
              style={{
                padding: '1rem',
                background: formValues.theme === th.id ? 'rgba(45, 106, 79, 0.4)' : 'rgba(255, 255, 255, 0.03)',
                border: formValues.theme === th.id ? '1px solid #e9c46a' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-xs)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{th.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>{th.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Danger Zone: Data Reset */}
      <div className="settings-section-card" style={{ borderColor: 'rgba(239, 68, 68, 0.25)' }}>
        <h2 className="settings-section-title" style={{ color: '#f87171' }}>
          <AlertTriangle size={18} color="#f87171" />
          <span>Reset Progress</span>
        </h2>
        <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
          Permanently clear all saved Pomodoro history, XP, streaks, level progression, and tasks stored in this browser.
        </p>
        <button
          type="button"
          onClick={handleResetClick}
          style={{
            padding: '0.55rem 1.15rem',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: 'var(--radius-xs)',
            color: '#f87171',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <RotateCcw size={15} />
          Reset All Data
        </button>
      </div>
    </div>
  );
}
