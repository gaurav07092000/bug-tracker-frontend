import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://bug-tracker-backend-977q.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    
    if (response.data && response.data.success) {
      return {
        ...response,
        data: response.data.data || response.data
      };
    }
    return response;
  },
  (error) => {
   
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  
  register: (name, email, password, role = 'USER') =>
    api.post('/auth/register', { name, email, password, role }),
  
  getProfile: () =>
    api.get('/auth/profile'),
  
  updateProfile: (data) =>
    api.put('/auth/profile', data),

  changePassword: (currentPassword, newPassword) =>
    api.put('/auth/change-password', { currentPassword, newPassword }),

  getUsers: (params = {}) =>
    api.get('/auth/users', { params }),

  getAssignableUsers: (params = {}) =>
    api.get('/auth/assignable-users', { params }),

  updateUserRole: (userId, role) =>
    api.put(`/auth/users/${userId}/role`, { role }),

  updateUserStatus: (userId, isActive) =>
    api.put(`/auth/users/${userId}/status`, { isActive }),

  deleteUser: (userId) =>
    api.delete(`/auth/users/${userId}`),
};

export const projectAPI = {
  getAll: (params = {}) =>
    api.get('/projects', { params }),
  
  getById: (id) =>
    api.get(`/projects/${id}`),
  
  create: (data) =>
    api.post('/projects', data),
  
  update: (id, data) =>
    api.put(`/projects/${id}`, data),
  
  delete: (id) =>
    api.delete(`/projects/${id}`),

  getStats: (id) =>
    api.get(`/projects/${id}/stats`),

  addMember: (id, userId, role = 'CONTRIBUTOR') =>
    api.post(`/projects/${id}/members`, { userId, role }),

  removeMember: (id, userId) =>
    api.delete(`/projects/${id}/members/${userId}`),

  updateMemberRole: (id, userId, role) =>
    api.put(`/projects/${id}/members/${userId}/role`, { role }),
};

export const ticketAPI = {
  getAll: (params = {}) =>
    api.get('/tickets', { params }),
  
  getById: (id) =>
    api.get(`/tickets/${id}`),
  
  create: (data) =>
    api.post('/tickets', data),
  
  update: (id, data) =>
    api.put(`/tickets/${id}`, data),
  
  delete: (id) =>
    api.delete(`/tickets/${id}`),

  assign: (ticketId, userId) =>
    api.put(`/tickets/${ticketId}/assign`, { userId }),

  unassign: (ticketId) =>
    api.put(`/tickets/${ticketId}/unassign`),

  getAssignedToMe: (params = {}) =>
    api.get('/tickets/assigned-to-me', { params }),

  getCreatedByMe: (params = {}) =>
    api.get('/tickets/created-by-me', { params }),

  getStats: () =>
    api.get('/tickets/stats'),

  getByProject: (projectId) =>
    api.get('/tickets', { params: { project: projectId } }),
  
  getUsers: () =>
    api.get('/auth/users'),
  
  assignTicket: (ticketId, userId) =>
    api.put(`/tickets/${ticketId}/assign`, { userId }),
  
  updateStatus: (ticketId, status) =>
    api.put(`/tickets/${ticketId}`, { status }),
  
  updatePriority: (ticketId, priority) =>
    api.put(`/tickets/${ticketId}`, { priority }),
};

export default api;