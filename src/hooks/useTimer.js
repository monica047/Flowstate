/**
 * Timestamp-based drift-free Pomodoro Timer Hook for Flowstate
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../utils/storage.js';

export function useTimer({
  settings,
  activeTaskId,
  onSessionComplete,
}) {
  const initialData = getStoredData(STORAGE_KEYS.TIMER_STATE, null);

  const getModeDurationSeconds = useCallback(
    (mode) => {
      if (mode === 'focus') return (settings.focusDuration || 25) * 60;
      if (mode === 'shortBreak') return (settings.shortBreakDuration || 5) * 60;
      if (mode === 'longBreak') return (settings.longBreakDuration || 15) * 60;
      return 25 * 60;
    },
    [settings]
  );

  const [mode, setMode] = useState(initialData?.mode || 'focus');
  const [cycleCount, setCycleCount] = useState(initialData?.cycleCount || 1);
  const [isRunning, setIsRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    if (initialData?.remainingSeconds !== undefined) {
      return initialData.remainingSeconds;
    }
    return getModeDurationSeconds('focus');
  });

  const targetEndTimeRef = useRef(null);
  const isCompletingRef = useRef(false);

  // Restore running timer across page reloads
  useEffect(() => {
    if (initialData?.isRunning && initialData?.targetEndTime) {
      const remainingMs = initialData.targetEndTime - Date.now();
      if (remainingMs > 0) {
        targetEndTimeRef.current = initialData.targetEndTime;
        setRemainingSeconds(Math.ceil(remainingMs / 1000));
        setIsRunning(true);
      } else {
        setRemainingSeconds(0);
        setIsRunning(false);
        handleSessionEnd(initialData.mode, initialData.cycleCount);
      }
    }
  }, []);

  const persistState = useCallback(
    (newIsRunning, newRemaining, newMode, newCycle, targetEndTime) => {
      setStoredData(STORAGE_KEYS.TIMER_STATE, {
        mode: newMode,
        remainingSeconds: newRemaining,
        isRunning: newIsRunning,
        targetEndTime: targetEndTime,
        cycleCount: newCycle,
        activeTaskId: activeTaskId,
        savedAt: Date.now(),
      });
    },
    [activeTaskId]
  );

  const handleSessionEnd = useCallback(
    (completedMode, currentCycle) => {
      if (isCompletingRef.current) return;
      isCompletingRef.current = true;

      const durationMinutes =
        completedMode === 'focus'
          ? settings.focusDuration || 25
          : completedMode === 'shortBreak'
          ? settings.shortBreakDuration || 5
          : settings.longBreakDuration || 15;

      let nextMode = 'focus';
      let nextCycle = currentCycle;

      if (completedMode === 'focus') {
        const interval = settings.longBreakInterval || 4;
        if (currentCycle >= interval) {
          nextMode = 'longBreak';
          nextCycle = 1;
        } else {
          nextMode = 'shortBreak';
          nextCycle = currentCycle + 1;
        }
      } else {
        nextMode = 'focus';
      }

      const nextDuration = getModeDurationSeconds(nextMode);

      onSessionComplete({
        mode: completedMode,
        durationMinutes,
        durationSeconds: durationMinutes * 60,
        cycleCount: currentCycle,
        nextMode,
      });

      setMode(nextMode);
      setCycleCount(nextCycle);
      setRemainingSeconds(nextDuration);

      const shouldAutoStart =
        (nextMode === 'focus' && settings.autoStartFocus) ||
        (nextMode !== 'focus' && settings.autoStartBreaks);

      if (shouldAutoStart) {
        const target = Date.now() + nextDuration * 1000;
        targetEndTimeRef.current = target;
        setIsRunning(true);
        persistState(true, nextDuration, nextMode, nextCycle, target);
      } else {
        setIsRunning(false);
        targetEndTimeRef.current = null;
        persistState(false, nextDuration, nextMode, nextCycle, null);
      }

      setTimeout(() => {
        isCompletingRef.current = false;
      }, 500);
    },
    [settings, getModeDurationSeconds, onSessionComplete, persistState]
  );

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(() => {
      if (!targetEndTimeRef.current) return;

      const remainingMs = targetEndTimeRef.current - Date.now();
      const currentRemaining = Math.max(0, Math.ceil(remainingMs / 1000));

      setRemainingSeconds(currentRemaining);

      if (currentRemaining <= 0) {
        clearInterval(intervalId);
        setIsRunning(false);
        targetEndTimeRef.current = null;
        handleSessionEnd(mode, cycleCount);
      }
    }, 250);

    return () => clearInterval(intervalId);
  }, [isRunning, mode, cycleCount, handleSessionEnd]);

  const startTimer = useCallback(() => {
    let duration = remainingSeconds;
    if (duration <= 0) {
      duration = getModeDurationSeconds(mode);
      setRemainingSeconds(duration);
    }
    const target = Date.now() + duration * 1000;
    targetEndTimeRef.current = target;
    setIsRunning(true);
    persistState(true, duration, mode, cycleCount, target);
  }, [remainingSeconds, mode, cycleCount, getModeDurationSeconds, persistState]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    targetEndTimeRef.current = null;
    persistState(false, remainingSeconds, mode, cycleCount, null);
  }, [remainingSeconds, mode, cycleCount, persistState]);

  const toggleTimer = useCallback(() => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }, [isRunning, pauseTimer, startTimer]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    targetEndTimeRef.current = null;
    const defaultDuration = getModeDurationSeconds(mode);
    setRemainingSeconds(defaultDuration);
    persistState(false, defaultDuration, mode, cycleCount, null);
  }, [mode, cycleCount, getModeDurationSeconds, persistState]);

  const skipTimer = useCallback(() => {
    setIsRunning(false);
    targetEndTimeRef.current = null;

    let nextMode = 'focus';
    let nextCycle = cycleCount;

    if (mode === 'focus') {
      nextMode = 'shortBreak';
      nextCycle = cycleCount + 1;
    } else if (mode === 'shortBreak') {
      nextMode = 'longBreak';
    } else {
      nextMode = 'focus';
      nextCycle = 1;
    }

    const nextDuration = getModeDurationSeconds(nextMode);
    setMode(nextMode);
    setCycleCount(nextCycle);
    setRemainingSeconds(nextDuration);
    persistState(false, nextDuration, nextMode, nextCycle, null);
  }, [mode, cycleCount, getModeDurationSeconds, persistState]);

  const switchMode = useCallback(
    (newMode) => {
      setIsRunning(false);
      targetEndTimeRef.current = null;
      setMode(newMode);
      const newDuration = getModeDurationSeconds(newMode);
      setRemainingSeconds(newDuration);
      persistState(false, newDuration, newMode, cycleCount, null);
    },
    [cycleCount, getModeDurationSeconds, persistState]
  );

  return {
    mode,
    cycleCount,
    remainingSeconds,
    isRunning,
    toggleTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    switchMode,
  };
}
