import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, teamMembersApi, prioritiesApi } from '../utils/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [priorities, setPriorities] = useState({});
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('saved');

  // Initialize app - check if user is logged in
  useEffect(() => {
    const initializeApp = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await authApi.getMe();
        setUser(userData);
        await loadTeamMembers();
      } catch (error) {
        console.error('Failed to initialize app:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Load team members and their priorities
  const loadTeamMembers = useCallback(async () => {
    try {
      const members = await teamMembersApi.getAll();
      setTeamMembers(members);

      // Load priorities for all team members
      const prioritiesData = {};
      await Promise.all(
        members.map(async (member) => {
          const memberPriorities = await prioritiesApi.getAll(member.id);
          prioritiesData[member.id] = memberPriorities;
        })
      );
      setPriorities(prioritiesData);
    } catch (error) {
      console.error('Failed to load team members:', error);
    }
  }, []);

  // Auth functions
  const login = async (email, password) => {
    const { manager, token } = await authApi.login(email, password);
    localStorage.setItem('token', token);
    setUser(manager);
    await loadTeamMembers();
  };

  const register = async (email, password, name) => {
    const { manager, token } = await authApi.register(email, password, name);
    localStorage.setItem('token', token);
    setUser(manager);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setTeamMembers([]);
      setPriorities({});
    }
  };

  // Team member functions
  const addTeamMember = async (name) => {
    const newMember = await teamMembersApi.create(name);
    setTeamMembers((prev) => [...prev, newMember]);
    setPriorities((prev) => ({ ...prev, [newMember.id]: [] }));
    return newMember;
  };

  const updateTeamMember = async (id, updates) => {
    const updated = await teamMembersApi.update(id, updates);
    setTeamMembers((prev) =>
      prev.map((member) => (member.id === id ? updated : member))
    );
    return updated;
  };

  const deleteTeamMember = async (id) => {
    await teamMembersApi.delete(id);
    setTeamMembers((prev) => prev.filter((member) => member.id !== id));
    setPriorities((prev) => {
      const newPriorities = { ...prev };
      delete newPriorities[id];
      return newPriorities;
    });
  };

  // Priority functions
  const addPriority = async (teamMemberId, content) => {
    setSaveStatus('saving');
    try {
      const newPriority = await prioritiesApi.create(teamMemberId, content);
      setPriorities((prev) => ({
        ...prev,
        [teamMemberId]: [...(prev[teamMemberId] || []), newPriority],
      }));
      setSaveStatus('saved');
      return newPriority;
    } catch (error) {
      setSaveStatus('error');
      throw error;
    }
  };

  const updatePriority = async (id, updates, teamMemberId) => {
    setSaveStatus('saving');
    try {
      const updated = await prioritiesApi.update(id, updates);
      setPriorities((prev) => ({
        ...prev,
        [teamMemberId]: prev[teamMemberId].map((priority) =>
          priority.id === id ? updated : priority
        ),
      }));
      setSaveStatus('saved');
      return updated;
    } catch (error) {
      setSaveStatus('error');
      throw error;
    }
  };

  const deletePriority = async (id, teamMemberId) => {
    setSaveStatus('saving');
    try {
      await prioritiesApi.delete(id);
      setPriorities((prev) => ({
        ...prev,
        [teamMemberId]: prev[teamMemberId].filter((priority) => priority.id !== id),
      }));
      setSaveStatus('saved');
    } catch (error) {
      setSaveStatus('error');
      throw error;
    }
  };

  const value = {
    user,
    teamMembers,
    priorities,
    loading,
    saveStatus,
    login,
    register,
    logout,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    addPriority,
    updatePriority,
    deletePriority,
    loadTeamMembers,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
