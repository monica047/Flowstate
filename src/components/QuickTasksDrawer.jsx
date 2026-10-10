import React, { useState } from 'react';
import { X, Plus, Check } from 'lucide-react';

export default function QuickTasksDrawer({
  tasks,
  activeTaskId,
  onSelectActiveTask,
  onToggleCompleteTask,
  onAddTask,
  onClose,
}) {
  const [newTitle, setNewTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(newTitle.trim());
    setNewTitle('');
  };

  return (
    <div className="quick-panel tasks-panel">
      <div className="quick-panel-header">
        <div className="quick-panel-title">
          <span>Focus Tasks</span>
        </div>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close">
          <X size={16} />
        </button>
      </div>

      <div className="quick-panel-body">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`quick-task-item ${activeTaskId === task.id ? 'selected' : ''}`}
          >
            <button
              type="button"
              className={`quick-task-checkbox ${task.completed ? 'checked' : ''}`}
              onClick={() => onToggleCompleteTask(task.id)}
              aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
            >
              {task.completed && <Check size={12} color="#ffffff" strokeWidth={3} />}
            </button>

            <span
              className={`quick-task-text ${task.completed ? 'completed' : ''}`}
              onClick={() => onSelectActiveTask(task.id)}
              style={{ cursor: 'pointer' }}
              title="Click to set as current focus target"
            >
              {task.title}
            </span>
          </div>
        ))}

        <form onSubmit={handleSubmit} style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            placeholder="Type your priority..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{ flex: 1, fontSize: '0.85rem' }}
          />
          <button
            type="submit"
            style={{
              background: 'var(--color-primary)',
              color: '#070e0a',
              borderRadius: 'var(--radius-xs)',
              padding: '0 0.75rem',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <Plus size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
