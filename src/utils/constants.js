export const TICKET_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
};

export const TICKET_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

export const TICKET_TYPE = {
  BUG: 'BUG',
  FEATURE: 'FEATURE',
  ENHANCEMENT: 'ENHANCEMENT',
  TASK: 'TASK',
};

export const PROJECT_STATUS = {
  PLANNING: 'PLANNING',
  ACTIVE: 'ACTIVE',
  ON_HOLD: 'ON_HOLD',
  COMPLETED: 'COMPLETED',
  ARCHIVED: 'ARCHIVED',
};

export const PROJECT_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  PROJECTS: '/projects',
  TICKETS: '/tickets',
  USERS: '/users',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  TICKETS: '/tickets',
  PROFILE: '/profile',
};

export const MESSAGES = {
  ERRORS: {
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    SERVER: 'Server error. Please try again later.',
    VALIDATION: 'Please check your input and try again.',
  },
  SUCCESS: {
    LOGIN: 'Successfully logged in!',
    REGISTER: 'Account created successfully!',
    TICKET_CREATED: 'Ticket created successfully!',
    TICKET_UPDATED: 'Ticket updated successfully!',
    TICKET_DELETED: 'Ticket deleted successfully!',
    PROJECT_CREATED: 'Project created successfully!',
    PROJECT_UPDATED: 'Project updated successfully!',
    PROJECT_DELETED: 'Project deleted successfully!',
  },
};