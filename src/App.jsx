import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header.jsx';
import BottomDock from './components/BottomDock.jsx';
import NavigationSidebar from './components/NavigationSidebar.jsx';
import QuickTasksDrawer from './components/QuickTasksDrawer.jsx';
import QuickNotesDrawer from './components/QuickNotesDrawer.jsx';
import QuickThemesDrawer from './components/QuickThemesDrawer.jsx';
import RewardModal from './components/RewardModal.jsx';
import ConfirmModal from './components/ConfirmModal.jsx';

import DashboardPage from './pages/DashboardPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import StatisticsPage from './pages/StatisticsPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import AchievementsPage from './pages/AchievementsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

import { useTimer } from './hooks/useTimer.js';
import { 
  STORAGE_KEYS, 
  DEFAULT_SETTINGS, 
  getStoredData, 
  setStoredData, 
  calculateLevelInfo, 
  evaluateAchievements, 
  resetAllAppData 
} from './utils/storage.js';
import { calculateStreak, getLocalDateString } from './utils/streak.js';
import { playSessionCompleteSound, playXpRewardSound } from './utils/audio.js';
import { sendTimerNotification } from './utils/notifications.js';

const FOREST_QUOTES = [
  "In every walk with nature, one receives far more than he seeks.",
  "Deep work is the superpower of the 21st century.",
  "Quiet the mind, and the soul will speak.",
  "Adopt the pace of nature: her secret is patience.",
  "Concentration is the root of all higher abilities in man.",
  "Focus is a muscle that grows with daily practice in the grove.",
];

export default function App() {
  // Navigation & Drawers
  const [activePage, setActivePage] = useState('dashboard');
  const [activeDrawer, setActiveDrawer] = useState(null); // 'tasks' | 'notes' | 'themes' | null
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Quote
  const quote = useMemo(() => {
    const dayIndex = new Date().getDate() % FOREST_QUOTES.length;
    return FOREST_QUOTES[dayIndex];
  }, []);

  // Settings
  const [settings, setSettings] = useState(() => {
    return { ...DEFAULT_SETTINGS, ...getStoredData(STORAGE_KEYS.SETTINGS, {}) };
  });

  const handleUpdateSettings = useCallback((newSettings) => {
    setSettings(newSettings);
    setStoredData(STORAGE_KEYS.SETTINGS, newSettings);
  }, []);

  // Tasks
  const [tasks, setTasks] = useState(() => {
    return getStoredData(STORAGE_KEYS.TASKS, [
      {
        id: 'task-1',
        title: 'Review deep focus strategy and outline deliverables',
        description: 'Prepare milestone roadmap and structure key phases',
        priority: 'high',
        estimatedSessions: 3,
        completedSessions: 1,
        completed: false,
        createdAt: Date.now() - 3600000,
      },
      {
        id: 'task-2',
        title: 'Architect component hierarchy and state hooks',
        description: 'Clean modular standard JavaScript without bloated dependencies',
        priority: 'medium',
        estimatedSessions: 2,
        completedSessions: 0,
        completed: false,
        createdAt: Date.now() - 7200000,
      },
    ]);
  });

  const [activeTaskId, setActiveTaskId] = useState(() => {
    const timerState = getStoredData(STORAGE_KEYS.TIMER_STATE, null);
    return timerState?.activeTaskId || 'task-1';
  });

  useEffect(() => {
    setStoredData(STORAGE_KEYS.TASKS, tasks);
  }, [tasks]);

  const activeTask = useMemo(() => {
    return tasks.find((t) => t.id === activeTaskId) || null;
  }, [tasks, activeTaskId]);

  const handleSelectActiveTask = useCallback((id) => {
    setActiveTaskId((prev) => (prev === id ? null : id));
  }, []);

  const handleToggleCompleteTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const handleAddTask = useCallback((taskData) => {
    const newTask = typeof taskData === 'string'
      ? {
          id: `task-${Date.now()}`,
          title: taskData,
          description: '',
          priority: 'medium',
          estimatedSessions: 1,
          completedSessions: 0,
          completed: false,
          createdAt: Date.now(),
        }
      : {
          id: `task-${Date.now()}`,
          ...taskData,
          completedSessions: 0,
          completed: false,
          createdAt: Date.now(),
        };

    setTasks((prev) => [newTask, ...prev]);
    if (!activeTaskId) {
      setActiveTaskId(newTask.id);
    }
  }, [activeTaskId]);

  const handleUpdateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const handleDeleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (activeTaskId === id) {
      setActiveTaskId(null);
    }
  }, [activeTaskId]);

  // Completed Sessions
  const [sessions, setSessions] = useState(() => {
    return getStoredData(STORAGE_KEYS.SESSIONS, []);
  });

  useEffect(() => {
    setStoredData(STORAGE_KEYS.SESSIONS, sessions);
  }, [sessions]);

  // User XP and Level
  const [userState, setUserState] = useState(() => {
    return getStoredData(STORAGE_KEYS.USER, { xp: 0, level: 1 });
  });

  useEffect(() => {
    setStoredData(STORAGE_KEYS.USER, userState);
  }, [userState]);

  const levelInfo = useMemo(() => {
    return calculateLevelInfo(userState.xp);
  }, [userState.xp]);

  // Streaks
  const streakData = useMemo(() => {
    return calculateStreak(sessions);
  }, [sessions]);

  // Achievements
  const [achievements, setAchievements] = useState(() => {
    return getStoredData(STORAGE_KEYS.ACHIEVEMENTS, {});
  });

  // Modals
  const [rewardModalData, setRewardModalData] = useState(null);
  const [confirmModalData, setConfirmModalData] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    onConfirm: () => {},
  });

  // Session completion handler
  const handleSessionComplete = useCallback(
    ({ mode: completedMode, durationMinutes, durationSeconds, cycleCount: completedCycle }) => {
      // 1. Play chime audio if enabled
      if (settings.soundEnabled) {
        playSessionCompleteSound(settings.volume);
      }

      // 2. Desktop notification
      if (settings.notificationsEnabled) {
        sendTimerNotification(
          completedMode === 'focus' ? 'Focus Session Completed!' : 'Break Concluded',
          completedMode === 'focus'
            ? `Great job! You stayed focused for ${durationMinutes} minutes.`
            : 'Break is over. Ready to step back into the grove?'
        );
      }

      // 3. Award XP for focus sessions only
      let xpEarned = 0;
      let didLevelUp = false;
      let nextXp = userState.xp;

      if (completedMode === 'focus') {
        xpEarned = Math.max(1, Math.round(durationMinutes));
        nextXp = userState.xp + xpEarned;
        const oldLevelInfo = calculateLevelInfo(userState.xp);
        const newLevelInfo = calculateLevelInfo(nextXp);

        if (newLevelInfo.level > oldLevelInfo.level) {
          didLevelUp = true;
          if (settings.soundEnabled) {
            setTimeout(() => playXpRewardSound(settings.volume), 600);
          }
        }

        setUserState({
          xp: nextXp,
          level: newLevelInfo.level,
        });

        // Increment active task session count
        if (activeTaskId) {
          setTasks((prev) =>
            prev.map((t) =>
              t.id === activeTaskId
                ? { ...t, completedSessions: (t.completedSessions || 0) + 1 }
                : t
            )
          );
        }
      }

      // 4. Save session record
      const sessionRecord = {
        id: `session-${Date.now()}`,
        mode: completedMode,
        durationMinutes,
        durationSeconds,
        timestamp: Date.now(),
        dateKey: getLocalDateString(new Date()),
        taskId: activeTaskId || null,
        xpEarned,
      };

      const updatedSessions = [sessionRecord, ...sessions];
      setSessions(updatedSessions);

      // 5. Evaluate achievements
      const updatedStreak = calculateStreak(updatedSessions);
      evaluateAchievements(updatedSessions, updatedStreak, achievements);

      // 6. Show reward modal
      setRewardModalData({
        sessionData: sessionRecord,
        totalXp: nextXp,
        levelInfo: calculateLevelInfo(nextXp),
        leveledUp: didLevelUp,
      });
    },
    [settings, userState.xp, activeTaskId, sessions, achievements]
  );

  // Main Timer Hook
  const {
    mode,
    cycleCount,
    remainingSeconds,
    isRunning,
    toggleTimer,
    resetTimer,
    skipTimer,
    switchMode,
  } = useTimer({
    settings,
    activeTaskId,
    onSessionComplete: handleSessionComplete,
  });

  // Calculate today stats
  const todayKey = getLocalDateString(new Date());
  const todayFocusMinutes = useMemo(() => {
    return sessions
      .filter((s) => s.mode === 'focus' && (s.dateKey || getLocalDateString(new Date(s.timestamp))) === todayKey)
      .reduce((acc, s) => acc + (s.durationMinutes || 25), 0);
  }, [sessions, todayKey]);

  const todaySessionsCount = useMemo(() => {
    return sessions.filter(
      (s) => s.mode === 'focus' && (s.dateKey || getLocalDateString(new Date(s.timestamp))) === todayKey
    ).length;
  }, [sessions, todayKey]);

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Drawer toggles
  const handleToggleDrawer = (drawerName) => {
    setActiveDrawer((prev) => (prev === drawerName ? null : drawerName));
  };

  // Sound toggle shortcut in dock
  const handleToggleSound = () => {
    handleUpdateSettings({
      ...settings,
      soundEnabled: !settings.soundEnabled,
    });
  };

  // Reset all data
  const handleResetAllData = () => {
    resetAllAppData();
    setSessions([]);
    setTasks([]);
    setUserState({ xp: 0, level: 1 });
    setAchievements({});
    setActiveTaskId(null);
    setSettings(DEFAULT_SETTINGS);
    setConfirmModalData((prev) => ({ ...prev, isOpen: false }));
    resetTimer();
  };

  return (
    <div className={`flowstate-app ${settings.theme || 'theme-forest'}`}>
      <div className="flowstate-ambient-overlay" />

      {/* Top Header */}
      <Header
        quote={quote}
        streak={streakData.currentStreak}
        xp={userState.xp}
        level={levelInfo.level}
        onOpenMenu={() => setIsNavOpen(true)}
        onGoDashboard={() => setActivePage('dashboard')}
        onOpenAchievements={() => setActivePage('achievements')}
      />

      {/* Main Content Area */}
      <main className="main-content-viewport">
        {activePage === 'dashboard' && (
          <DashboardPage
            timeLeft={remainingSeconds}
            isRunning={isRunning}
            mode={mode}
            cycleCount={cycleCount}
            activeTask={activeTask}
            onToggleTimer={toggleTimer}
            onResetTimer={resetTimer}
            onSkipTimer={skipTimer}
            onSelectMode={switchMode}
            onOpenTasksModal={() => handleToggleDrawer('tasks')}
            streak={streakData.currentStreak}
            xp={userState.xp}
            level={levelInfo.level}
            levelInfo={levelInfo}
            todaySessionsCount={todaySessionsCount}
            todayFocusMinutes={todayFocusMinutes}
            onNavigateToTasks={() => setActivePage('tasks')}
          />
        )}

        {activePage === 'tasks' && (
          <TasksPage
            tasks={tasks}
            activeTaskId={activeTaskId}
            onSelectActiveTask={handleSelectActiveTask}
            onToggleCompleteTask={handleToggleCompleteTask}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activePage === 'statistics' && (
          <StatisticsPage
            sessions={sessions}
            streak={streakData.currentStreak}
            longestStreak={streakData.longestStreak}
            totalXp={userState.xp}
            tasks={tasks}
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'calendar' && (
          <CalendarPage
            sessions={sessions}
            streak={streakData.currentStreak}
            longestStreak={streakData.longestStreak}
          />
        )}

        {activePage === 'achievements' && (
          <AchievementsPage
            achievements={achievements}
            sessions={sessions}
            streakData={streakData}
          />
        )}

        {activePage === 'settings' && (
          <SettingsPage
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetAllData={handleResetAllData}
            onOpenConfirmModal={(opts) => setConfirmModalData({ isOpen: true, ...opts })}
          />
        )}
      </main>

      {/* Bottom Dock Navigation */}
      <BottomDock
        activePage={activePage}
        onNavigate={setActivePage}
        streak={streakData.currentStreak}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        activeDrawer={activeDrawer}
        onToggleDrawer={handleToggleDrawer}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Quick Drawers */}
      {activeDrawer === 'tasks' && (
        <QuickTasksDrawer
          tasks={tasks}
          activeTaskId={activeTaskId}
          onSelectActiveTask={handleSelectActiveTask}
          onToggleCompleteTask={handleToggleCompleteTask}
          onAddTask={(title) => handleAddTask({ title })}
          onClose={() => setActiveDrawer(null)}
        />
      )}

      {activeDrawer === 'notes' && (
        <QuickNotesDrawer onClose={() => setActiveDrawer(null)} />
      )}

      {activeDrawer === 'themes' && (
        <QuickThemesDrawer
          currentTheme={settings.theme || 'theme-forest'}
          onSelectTheme={(themeId) => handleUpdateSettings({ ...settings, theme: themeId })}
          onClose={() => setActiveDrawer(null)}
        />
      )}

      {/* Navigation Sidebar Drawer */}
      <NavigationSidebar
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        activePage={activePage}
        onNavigate={setActivePage}
        streak={streakData.currentStreak}
        xp={userState.xp}
        level={levelInfo.level}
        levelInfo={levelInfo}
      />

      {/* Reward / Level Up Modal */}
      {rewardModalData && (
        <RewardModal
          isOpen={Boolean(rewardModalData)}
          sessionData={rewardModalData.sessionData}
          totalXp={rewardModalData.totalXp}
          levelInfo={rewardModalData.levelInfo}
          leveledUp={rewardModalData.leveledUp}
          onClose={() => setRewardModalData(null)}
        />
      )}

      {/* Confirmation Dialog Modal */}
      <ConfirmModal
        isOpen={confirmModalData.isOpen}
        title={confirmModalData.title}
        message={confirmModalData.message}
        confirmLabel={confirmModalData.confirmLabel}
        onConfirm={confirmModalData.onConfirm}
        onCancel={() => setConfirmModalData((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
