
export const formatDate = (dateString) => {
  if (!dateString) return 'Not set';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Get CSS class for status
 */
export const getStatusClass = (status) => {
  const statusClasses = {
    'OPEN': 'status-open',
    'IN_PROGRESS': 'status-in-progress',
    'RESOLVED': 'status-resolved',
    'CLOSED': 'status-closed',
  };
  return statusClasses[status] || 'status-open';
};

/**
 * Get CSS class for priority
 */
export const getPriorityClass = (priority) => {
  const priorityClasses = {
    'LOW': 'priority-low',
    'MEDIUM': 'priority-medium',
    'HIGH': 'priority-high',
  };
  return priorityClasses[priority] || 'priority-low';
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password) => {
  return password.length >= 6;
};

/**
 * Generate unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Capitalize first letter of string
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if user has admin role
 */
export const isAdmin = (user) => {
  return user && user.role && user.role.toLowerCase() === 'admin';
};

/**
 * Filter tickets based on filters
 */
export const filterTickets = (tickets, filters) => {
  if (!Array.isArray(tickets)) {
    return [];
  }
  
  return tickets.filter(ticket => {
    const matchesSearch = !filters.search || 
      (ticket.title && ticket.title.toLowerCase().includes(filters.search.toLowerCase())) ||
      (ticket.description && ticket.description.toLowerCase().includes(filters.search.toLowerCase()));
    
    const matchesStatus = filters.status === 'all' || 
      ticket.status === filters.status;
    
    const matchesPriority = filters.priority === 'all' || 
      ticket.priority === filters.priority;
    
    let matchesUser = false;
    
    if (filters.assignedUser === 'all') {
      matchesUser = true;
    } else {
      const ticketAssignedTo = ticket.assignedTo;
      
      if (typeof ticketAssignedTo === 'string') {
        matchesUser = ticketAssignedTo === filters.assignedUser;
      } else if (ticketAssignedTo && typeof ticketAssignedTo === 'object') {
        matchesUser = (ticketAssignedTo._id === filters.assignedUser) || 
                     (ticketAssignedTo.id === filters.assignedUser);
      } else {
        matchesUser = false;
      }
    }
    
    return matchesSearch && matchesStatus && matchesPriority && matchesUser;
  });
};