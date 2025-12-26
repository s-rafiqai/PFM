import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAutoSave } from '../hooks/useAutoSave';

const PriorityItem = ({ priority, teamMemberId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(priority.content);
  const [showDelete, setShowDelete] = useState(false);
  const inputRef = useRef(null);

  const { updatePriority, deletePriority } = useApp();

  const saveContent = useAutoSave(async () => {
    if (content.trim() !== priority.content && content.trim() !== '') {
      await updatePriority(priority.id, { content: content.trim() }, teamMemberId);
    }
  }, 500);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (content.trim() === '') {
      setContent(priority.content);
    } else if (content.trim() !== priority.content) {
      saveContent();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      setContent(priority.content);
      setIsEditing(false);
    }
  };

  const handleToggleComplete = async () => {
    const newStatus = priority.status === 'active' ? 'completed' : 'active';
    await updatePriority(priority.id, { status: newStatus }, teamMemberId);
  };

  const handleDelete = async () => {
    await deletePriority(priority.id, teamMemberId);
  };

  const isCompleted = priority.status === 'completed';

  return (
    <div
      className="group flex items-start gap-2 py-1 px-2 rounded hover:bg-gray-50 transition-colors"
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <button
        onClick={handleToggleComplete}
        className="mt-0.5 flex-shrink-0 w-4 h-4 border border-gray-300 rounded hover:border-gray-400 flex items-center justify-center transition-colors"
      >
        {isCompleted && (
          <svg
            className="w-3 h-3 text-gray-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        )}
      </button>

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-sm"
        />
      ) : (
        <span
          onClick={() => setIsEditing(true)}
          className={`flex-1 cursor-pointer text-sm ${
            isCompleted ? 'line-through text-gray-400' : 'text-gray-700'
          }`}
        >
          {priority.content}
        </span>
      )}

      {showDelete && !isEditing && (
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 flex-shrink-0 text-gray-400 hover:text-red-500 transition-all"
          title="Delete priority"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default PriorityItem;
