import React, { useState, useEffect } from 'react';
import { X, Trash2, Edit2 } from 'lucide-react';
import { getStoredData, setStoredData } from '../utils/storage.js';

export default function QuickNotesDrawer({ onClose }) {
  const [noteContent, setNoteContent] = useState(() => {
    return getStoredData('flowstate_scratchpad_v1', 'Brain dump your best ideas and insights without distractions.');
  });

  useEffect(() => {
    setStoredData('flowstate_scratchpad_v1', noteContent);
  }, [noteContent]);

  const wordsCount = noteContent.trim() ? noteContent.trim().split(/\s+/).length : 0;
  const charsCount = noteContent.length;

  return (
    <div className="quick-panel tasks-panel" style={{ width: '380px' }}>
      <div className="quick-panel-header">
        <div className="quick-panel-title">
          <Edit2 size={16} />
          <span>Quick Scratchpad</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginLeft: '0.5rem' }}>
            {wordsCount} words · {charsCount} chars
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button
            type="button"
            className="modal-close-btn"
            onClick={() => setNoteContent('')}
            title="Clear note"
            aria-label="Clear note"
          >
            <Trash2 size={14} />
          </button>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="quick-panel-body" style={{ padding: '0.75rem' }}>
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Capture quick thoughts during your focus session..."
          style={{
            width: '100%',
            height: '240px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#ffffff',
            fontSize: '0.9rem',
            lineHeight: 1.6,
            resize: 'none',
          }}
        />
      </div>
    </div>
  );
}
