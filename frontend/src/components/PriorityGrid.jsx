import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TeamMemberPanel from './TeamMemberPanel';
import { calculateGridLayout, getGridStyle } from '../utils/gridCalculations';

const PriorityGrid = () => {
  const [newMemberName, setNewMemberName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const { teamMembers, addTeamMember } = useApp();

  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    if (newMemberName.trim() === '') return;

    try {
      await addTeamMember(newMemberName.trim());
      setNewMemberName('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add team member:', error);
    }
  };

  const { columns, rows, fontSize } = calculateGridLayout(teamMembers.length);
  const gridStyle = getGridStyle(columns, rows);

  // Empty state - no team members
  if (teamMembers.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md px-4">
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Welcome to Priority Focus Manager
          </h2>
          <p className="text-gray-600 mb-8">
            Start by adding your first team member to track their priorities
          </p>

          {showAddForm ? (
            <form onSubmit={handleAddTeamMember} className="flex gap-2">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Team member name"
                autoFocus
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setNewMemberName('');
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add First Team Member
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Add Team Member Button */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {teamMembers.length} {teamMembers.length === 1 ? 'team member' : 'team members'}
        </div>

        {showAddForm ? (
          <form onSubmit={handleAddTeamMember} className="flex gap-2">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Name"
              autoFocus
              className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setNewMemberName('');
              }}
              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 focus:outline-none"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none"
          >
            + Add Team Member
          </button>
        )}
      </div>

      {/* Grid of Team Member Panels */}
      <div className="flex-1 p-6 overflow-hidden">
        <div style={gridStyle}>
          {teamMembers.map((member) => (
            <TeamMemberPanel key={member.id} teamMember={member} fontSize={fontSize} />
          ))}
        </div>
      </div>

      {/* Visual Feedback Message (when many team members) */}
      {teamMembers.length >= 8 && (
        <div className="px-6 py-3 bg-amber-50 border-t border-amber-200">
          <p className="text-xs text-amber-800 text-center">
            With {teamMembers.length} team members, the view is intentionally constrained.
            Consider whether this reflects your team's optimal size.
          </p>
        </div>
      )}
    </div>
  );
};

export default PriorityGrid;
