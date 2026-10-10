import React, { useState } from 'react';
import { 
  Plus, 
  Check, 
  Trash2, 
  Edit3, 
  Target, 
  CheckCircle2, 
  Clock, 
  X
} from 'lucide-react';

export default function TasksPage({
  tasks,
  activeTaskId,
  onSelectActiveTask,
  onToggleCompleteTask,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) {
  const [filter, setFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [estimatedSessions, setEstimatedSessions] = useState(2);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setEstimatedSessions(2);
    setEditingTaskId(null);
    setIsFormOpen(false);
  };

  const startEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority || 'medium');
    setEstimatedSessions(task.estimatedSessions || 1);
    setEditingTaskId(task.id);
    setIsFormOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTaskId) {
      onUpdateTask(editingTaskId, {
        title: title.trim(),
        description: description.trim(),
        priority,
        estimatedSessions: Number(estimatedSessions) || 1,
      });
    } else {
      onAddTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        estimatedSessions: Number(estimatedSessions) || 1,
      });
    }
    resetForm();
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    if (filter === 'high') return t.priority === 'high' && !t.completed;
    return true;
  });

  return (
    <div className="tasks-container">
      {/* Header Row */}
      <div className="tasks-header-row">
        <div className="tasks-title-group">
          <h1>Tasks Manager</h1>
          <p>Organize objectives and connect them to focused Pomodoro sprints</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="task-filter-tabs">
            <button
              type="button"
              className={`task-filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({tasks.length})
            </button>
            <button
              type="button"
              className={`task-filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active ({tasks.filter((t) => !t.completed).length})
            </button>
            <button
              type="button"
              className={`task-filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed ({tasks.filter((t) => t.completed).length})
            </button>
            <button
              type="button"
              className={`task-filter-btn ${filter === 'high' ? 'active' : ''}`}
              onClick={() => setFilter('high')}
            >
              High Priority
            </button>
          </div>

          {!isFormOpen && (
            <button
              type="button"
              className="task-btn-primary"
              onClick={() => {
                resetForm();
                setIsFormOpen(true);
              }}
            >
              <Plus size={16} />
              <span>New Task</span>
            </button>
          )}
        </div>
      </div>

      {/* Task Creation / Edit Form Card */}
      {isFormOpen && (
        <form className="task-form-card" onSubmit={handleSave}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
              {editingTaskId ? 'Edit Task' : 'Create New Focus Task'}
            </span>
            <button type="button" className="modal-close-btn" onClick={resetForm} aria-label="Cancel">
              <X size={18} />
            </button>
          </div>

          <div className="task-form-row">
            <input
              type="text"
              className="task-form-input"
              placeholder="What are you working on?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="task-form-row">
            <textarea
              className="task-form-input"
              placeholder="Optional notes, checklist, or context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          <div className="task-form-row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Priority:
                </label>
                <select
                  className="task-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                  Estimated Sessions:
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  className="task-select"
                  style={{ width: '70px', textAlign: 'center' }}
                  value={estimatedSessions}
                  onChange={(e) => setEstimatedSessions(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                className="task-filter-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
              <button type="submit" className="task-btn-primary">
                {editingTaskId ? 'Save Changes' : 'Create Task'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Task Cards List */}
      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <CheckCircle2 size={26} />
          </div>
          <h3>No tasks in this view</h3>
          <p>
            {filter === 'completed'
              ? 'Complete a task during your focus session to see it celebrated here.'
              : 'Add your first task to align your Pomodoro sessions with clear goals.'}
          </p>
          {!isFormOpen && (
            <button
              type="button"
              className="task-btn-primary"
              onClick={() => setIsFormOpen(true)}
              style={{ marginTop: '0.5rem' }}
            >
              <Plus size={16} />
              <span>Add Task</span>
            </button>
          )}
        </div>
      ) : (
        filteredTasks.map((task) => {
          const isActiveTarget = activeTaskId === task.id;
          return (
            <div
              key={task.id}
              className={`task-card ${isActiveTarget ? 'active-target' : ''}`}
            >
              <div className="task-card-left">
                <button
                  type="button"
                  className={`task-checkbox-btn ${task.completed ? 'checked' : ''}`}
                  onClick={() => onToggleCompleteTask(task.id)}
                  title={task.completed ? "Mark pending" : "Mark completed"}
                >
                  {task.completed && <Check size={14} color="#ffffff" strokeWidth={3} />}
                </button>

                <div className="task-card-content">
                  <div className={`task-card-title ${task.completed ? 'completed' : ''}`}>
                    {task.title}
                  </div>
                  {task.description && (
                    <div className="task-card-desc">{task.description}</div>
                  )}

                  <div className="task-badges-row">
                    <span className={`priority-indicator priority-${task.priority || 'medium'}`}>
                      {task.priority || 'medium'}
                    </span>
                    <span>·</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} />
                      {task.completedSessions || 0} / {task.estimatedSessions || 1} Pomodoros
                    </span>
                    {task.completed && (
                      <>
                        <span>·</span>
                        <span style={{ color: '#52b788', fontWeight: 600 }}>Completed</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="task-card-actions">
                {!task.completed && (
                  <button
                    type="button"
                    className={`focus-here-btn ${isActiveTarget ? 'active' : ''}`}
                    onClick={() => onSelectActiveTask(task.id)}
                    title={isActiveTarget ? "Current focus target" : "Set as active focus target"}
                  >
                    <Target size={14} />
                    <span>{isActiveTarget ? 'Active Focus' : 'Focus'}</span>
                  </button>
                )}

                <button
                  type="button"
                  className="task-icon-action-btn"
                  onClick={() => startEdit(task)}
                  title="Edit task"
                >
                  <Edit3 size={15} />
                </button>

                <button
                  type="button"
                  className="task-icon-action-btn delete"
                  onClick={() => onDeleteTask(task.id)}
                  title="Delete task"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
