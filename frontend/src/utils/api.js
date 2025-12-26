const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new ApiError(error.error || 'Request failed', response.status);
  }
  return response.json();
};

// Auth API
export const authApi = {
  register: async (email, password, name) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  getMe: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Team Members API
export const teamMembersApi = {
  getAll: async (includeArchived = false) => {
    const url = includeArchived
      ? `${API_BASE_URL}/team-members?include_archived=true`
      : `${API_BASE_URL}/team-members`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  create: async (name) => {
    const response = await fetch(`${API_BASE_URL}/team-members`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    return handleResponse(response);
  },

  update: async (id, updates) => {
    const response = await fetch(`${API_BASE_URL}/team-members/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  },

  reorder: async (orderMap) => {
    const response = await fetch(`${API_BASE_URL}/team-members/reorder`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ order_map: orderMap }),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/team-members/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// Priorities API
export const prioritiesApi = {
  getAll: async (teamMemberId) => {
    const response = await fetch(
      `${API_BASE_URL}/team-members/${teamMemberId}/priorities`,
      {
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  create: async (teamMemberId, content) => {
    const response = await fetch(
      `${API_BASE_URL}/team-members/${teamMemberId}/priorities`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ content }),
      }
    );
    return handleResponse(response);
  },

  update: async (id, updates) => {
    const response = await fetch(`${API_BASE_URL}/priorities/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  },

  reorder: async (teamMemberId, orderMap) => {
    const response = await fetch(`${API_BASE_URL}/priorities/reorder`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        team_member_id: teamMemberId,
        order_map: orderMap,
      }),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/priorities/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};
