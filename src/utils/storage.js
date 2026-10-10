/**
 * Centralized LocalStorage persistence and data integrity for Flowstate
 */

import { getLocalDateString } from './streak.js';

export const STORAGE_KEYS = {
  SETTINGS: 'flowstate_settings_v1',
  TIMER_STATE: 'flowstate_timer_v1',
  TASKS: 'flowstate_tasks_v1',
  SESSIONS: 'flowstate_sessions_v1',
  USER: 'flowstate_user_v1',
  ACHIEVEMENTS: 'flowstate_achievements_v1',
};

export const DEFAULT_SETTINGS = {
  focusDuration: 25, // minutes
  shortBreakDuration: 5, // minutes
  longBreakDuration: 15, // minutes
  longBreakInterval: 4, // sessions before long break
  autoStartBreaks: false,
  autoStartFocus: false,
  soundEnabled: true,
  volume: 0.7,
  notificationsEnabled: false,
  theme: 'theme-forest',
  reducedMotion: false,
};

export const ACHIEVEMENTS_LIST = [
  {
    id: 'first_session',
    title: 'First Step',
    description: 'Complete your first focus session',
    iconName: 'Flame',
    target: 1,
    check: (sessions) => sessions.filter((s) => s.mode === 'focus').length >= 1,
    progress: (sessions) => Math.min(1, sessions.filter((s) => s.mode === 'focus').length),
  },
  {
    id: 'five_sessions',
    title: 'Focus Momentum',
    description: 'Complete 5 total focus sessions',
    iconName: 'Zap',
    target: 5,
    check: (sessions) => sessions.filter((s) => s.mode === 'focus').length >= 5,
    progress: (sessions) => Math.min(5, sessions.filter((s) => s.mode === 'focus').length),
  },
  {
    id: 'one_hour_day',
    title: 'Deep Diver',
    description: 'Accumulate at least 1 hour of focus in a single day',
    iconName: 'Clock',
    target: 60,
    check: (sessions) => {
      const minutesByDate = {};
      sessions.filter((s) => s.mode === 'focus').forEach((s) => {
        const d = s.dateKey || getLocalDateString(new Date(s.timestamp));
        minutesByDate[d] = (minutesByDate[d] || 0) + (s.durationMinutes || Math.round(s.durationSeconds / 60));
      });
      return Object.values(minutesByDate).some((m) => m >= 60);
    },
    progress: (sessions) => {
      const minutesByDate = {};
      sessions.filter((s) => s.mode === 'focus').forEach((s) => {
        const d = s.dateKey || getLocalDateString(new Date(s.timestamp));
        minutesByDate[d] = (minutesByDate[d] || 0) + (s.durationMinutes || Math.round(s.durationSeconds / 60));
      });
      const maxMin = Math.max(0, ...Object.values(minutesByDate));
      return Math.min(60, maxMin);
    },
  },
  {
    id: 'seven_day_streak',
    title: 'Unstoppable Habit',
    description: 'Achieve an unbroken 7-day focus streak',
    iconName: 'Calendar',
    target: 7,
    check: (sessions, streakData) => streakData.longestStreak >= 7,
    progress: (sessions, streakData) => Math.min(7, streakData.longestStreak || 0),
  },
  {
    id: 'ten_hours_total',
    title: 'Centurion of Focus',
    description: 'Log 10 total hours (600 minutes) of completed deep focus',
    iconName: 'Award',
    target: 600,
    check: (sessions) => {
      const totalMin = sessions
        .filter((s) => s.mode === 'focus')
        .reduce((acc, s) => acc + (s.durationMinutes || Math.round(s.durationSeconds / 60)), 0);
      return totalMin >= 600;
    },
    progress: (sessions) => {
      const totalMin = sessions
        .filter((s) => s.mode === 'focus')
        .reduce((acc, s) => acc + (s.durationMinutes || Math.round(s.durationSeconds / 60)), 0);
      return Math.min(600, totalMin);
    },
  },
  {
    id: 'twenty_five_sessions',
    title: 'Flowstate Master',
    description: 'Complete 25 focus sessions',
    iconName: 'Trophy',
    target: 25,
    check: (sessions) => sessions.filter((s) => s.mode === 'focus').length >= 25,
    progress: (sessions) => Math.min(25, sessions.filter((s) => s.mode === 'focus').length),
  },
];

export function getStoredData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading from localStorage (${key}):`, err);
    return fallback;
  }
}

export function setStoredData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing to localStorage (${key}):`, err);
  }
}

export function calculateLevelInfo(totalXp = 0) {
  let level = 1;
  let remainingXp = Math.max(0, totalXp);

  while (true) {
    const xpNeededForThisLevel = 50 + level * 50;
    if (remainingXp < xpNeededForThisLevel) {
      const progressPercent = Math.min(100, Math.round((remainingXp / xpNeededForThisLevel) * 100));
      return {
        level,
        xpInCurrentLevel: remainingXp,
        xpForNextLevel: xpNeededForThisLevel,
        progressPercent,
      };
    }
    remainingXp -= xpNeededForThisLevel;
    level += 1;
  }
}

export function evaluateAchievements(sessions, streakData, existingAchievements = {}) {
  const updated = { ...existingAchievements };
  const newlyUnlocked = [];

  for (const ach of ACHIEVEMENTS_LIST) {
    const isAlreadyUnlocked = Boolean(updated[ach.id]?.unlocked);
    if (!isAlreadyUnlocked) {
      if (ach.check(sessions, streakData)) {
        updated[ach.id] = {
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        };
        newlyUnlocked.push(ach);
      }
    }
  }

  setStoredData(STORAGE_KEYS.ACHIEVEMENTS, updated);
  return { updatedAchievements: updated, newlyUnlocked };
}

export function resetAllAppData() {
  try {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    console.error('Reset error:', e);
  }
}
