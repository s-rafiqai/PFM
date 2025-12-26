import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import PriorityItem from './PriorityItem';
import AddPriority from './AddPriority';
import { useAutoSave } from '../hooks/useAutoSave';

const TeamMemberPanel = ({ teamMember, fontSize }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [name, setName] = useState(teamMember.name);
  const [showMenu, setShowMenu] = useState(false);
  const nameInputRef = useRef(null);
  const menuRef = useRef(null);

  const { updateTeamMember, deleteTeamMember, priorities } = useApp();

  const saveName = useAutoSave(async () => {
    if (name.trim() !== teamMember.name && name.trim() !== '') {
      await updateTeamMember(teamMember.id, { name: name.trim() });
    }
  }, 500);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleNameBlur = () => {
    setIsEditingName(false);
    if (name.trim() === '') {
      setName(teamMember.name);
    } else if (name.trim() !== teamMember.name) {
      saveName();
    }
  };

  const handleNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNameBlur();
    } else if (e.key === 'Escape') {
      setName(teamMember.name);
      setIsEditingName(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        `Are you sure you want to remove ${teamMember.name}? This will archive them and their priorities.`
      )
    ) {
      await deleteTeamMember(teamMember.id);
    }
    setShowMenu(false);
  };

  const memberPriorities = priorities[teamMember.id] || [];
  const activePriorities = memberPriorities.filter((p) => p.status === 'active');
  const completedPriorities = memberPriorities.filter((p) => p.status === 'completed');

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col"
      style={{ fontSize }}
    >
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between bg-gray-50">
        {isEditingName ? (
          <input
            ref={nameInputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={handleNameKeyDown}
            className="flex-1 bg-white border border-gray-300 rounded px-2 py-1 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <h3
            onClick={() => setIsEditingName(true)}
            className="flex-1 font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
          >
            {teamMember.name}
          </h3>
        )}

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
            </svg>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <button
                onClick={() => {
                  setIsEditingName(true);
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Rename
              </button>
              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Priorities List */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Active Priorities */}
        {activePriorities.length > 0 && (
          <div className="space-y-1">
            {activePriorities.map((priority) => (
              <PriorityItem
                key={priority.id}
                priority={priority}
                teamMemberId={teamMember.id}
              />
            ))}
          </div>
        )}

        {/* Completed Priorities */}
        {completedPriorities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {completedPriorities.map((priority) => (
              <PriorityItem
                key={priority.id}
                priority={priority}
                teamMemberId={teamMember.id}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {memberPriorities.length === 0 && (
          <p className="text-gray-400 text-sm italic">No priorities yet</p>
        )}

        {/* Add Priority */}
        <AddPriority teamMemberId={teamMember.id} />
      </div>
    </div>
  );
};

export default TeamMemberPanel;
