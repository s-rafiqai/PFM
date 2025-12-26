import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';

const AddPriority = ({ teamMemberId }) => {
  const [content, setContent] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const { addPriority } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.trim() === '') return;

    try {
      await addPriority(teamMemberId, content.trim());
      setContent('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to add priority:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setContent('');
      inputRef.current?.blur();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">+</span>
        <input
          ref={inputRef}
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder="Add priority..."
          className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 focus:placeholder-gray-500"
        />
      </div>
    </form>
  );
};

export default AddPriority;
