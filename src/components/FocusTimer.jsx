import React from 'react';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

export default function FocusTimer({
  timeLeft,
  isRunning,
  mode,
  cycleCount,
  activeTask,
  onToggleTimer,
  onResetTimer,
  onSkipTimer,
  onSelectMode,
  onOpenTasksModal,
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="timer-container">
      {/* Active Focus Task / Goal Prompt */}
      <div className="focus-prompt-container">
        {activeTask ? (
          <button 
            type="button" 
            className="focus-task-pill"
            onClick={onOpenTasksModal}
            title="Click to switch or edit active task"
          >
            <span className="task-tag">Focusing on:</span>
            <span>{activeTask.title}</span>
          </button>
        ) : (
          <button 
            type="button" 
            className="focus-prompt-title"
            onClick={onOpenTasksModal}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            What do you want to focus on?
          </button>
        )}
      </div>

      {/* Mode Selectors: FOCUS, SHORT BREAK, LONG BREAK */}
      <div className="timer-modes" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'focus'}
          className={`timer-mode-btn ${mode === 'focus' ? 'active' : ''}`}
          onClick={() => onSelectMode('focus')}
        >
          FOCUS
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'shortBreak'}
          className={`timer-mode-btn ${mode === 'shortBreak' ? 'active' : ''}`}
          onClick={() => onSelectMode('shortBreak')}
        >
          SHORT BREAK
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'longBreak'}
          className={`timer-mode-btn ${mode === 'longBreak' ? 'active' : ''}`}
          onClick={() => onSelectMode('longBreak')}
        >
          LONG BREAK
        </button>
      </div>

      {/* Hero Timer Display */}
      <div className="timer-clock tabular-nums">
        {formatTime(timeLeft)}
      </div>

      {/* Control Buttons */}
      <div className="timer-controls">
        <button
          type="button"
          className="timer-control-btn"
          onClick={onResetTimer}
          title="Reset timer to mode default"
          aria-label="Reset timer"
        >
          <RotateCcw size={22} />
        </button>

        <button
          type="button"
          className="timer-control-btn primary"
          onClick={onToggleTimer}
          title={isRunning ? "Pause Focus Session" : "Start Focus Session"}
          aria-label={isRunning ? "Pause timer" : "Start timer"}
        >
          {isRunning ? <Pause size={30} fill="currentColor" /> : <Play size={30} fill="currentColor" style={{ marginLeft: '4px' }} />}
        </button>

        <button
          type="button"
          className="timer-control-btn"
          onClick={onSkipTimer}
          title="Skip to next session"
          aria-label="Skip session"
        >
          <SkipForward size={22} />
        </button>
      </div>
    </div>
  );
}
