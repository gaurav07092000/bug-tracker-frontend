import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ticketAPI, authAPI } from '../../services/api';

export const fetchTickets = createAsyncThunk(
  'tickets/fetchTickets',
  async (params = {}, { rejectWithValue }) => {
    try {
      if (typeof params === 'string') {
        params = { project: params };
      }
      
      const response = await ticketAPI.getAll(params);
      return response.data?.tickets || response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tickets');
    }
  }
);

export const fetchFilteredTickets = createAsyncThunk(
  'tickets/fetchFilteredTickets',
  async ({ projectId, filters = {} }, { rejectWithValue }) => {
    try {
      const params = { project: projectId };
      
      if (filters.status && filters.status !== 'all') {
        params.status = filters.status;
      }
      if (filters.priority && filters.priority !== 'all') {
        params.priority = filters.priority;
      }
      if (filters.assignedUser && filters.assignedUser !== 'all') {
        params.assignedTo = filters.assignedUser;
      }
      if (filters.search && filters.search.trim()) {
        params.search = filters.search.trim();
      }
      
      const response = await ticketAPI.getAll(params);
      return response.data?.tickets || response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch filtered tickets');
    }
  }
);

export const createTicket = createAsyncThunk(
  'tickets/createTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await ticketAPI.create(ticketData);
      // Handle nested response structure
      return response.data?.ticket || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create ticket');
    }
  }
);

export const updateTicket = createAsyncThunk(
  'tickets/updateTicket',
  async ({ id, ticketData }, { rejectWithValue }) => {
    try {
      const response = await ticketAPI.update(id, ticketData);
      return response.data?.ticket || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update ticket');
    }
  }
);

export const deleteTicket = createAsyncThunk(
  'tickets/deleteTicket',
  async (id, { rejectWithValue }) => {
    try {
      await ticketAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete ticket');
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'tickets/fetchUsers',
  async (projectId, { rejectWithValue }) => {
    try {
      if (projectId === null || projectId === undefined) {
        const response = await authAPI.getUsers({ 
          isActive: true, 
          limit: 100,
          page: 1
        });
        const users = response.data?.users || response.data || [];
        return users;
      } else {
        const response = await authAPI.getAssignableUsers({ projectId });
        const users = response.data?.users || response.data || [];
        return users;
      }
    } catch (error) {
      console.error('Error in fetchUsers thunk:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

const initialState = {
  tickets: [],
  users: [],
  selectedTicket: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'all',
    priority: 'all',
    assignedUser: 'all',
  },
};

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    selectTicket: (state, action) => {
      state.selectedTicket = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        status: 'all',
        priority: 'all',
        assignedUser: 'all',
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.tickets = [];
        state.error = action.payload;
      })
      .addCase(fetchFilteredTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilteredTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchFilteredTickets.rejected, (state, action) => {
        state.loading = false;
        state.tickets = [];
        state.error = action.payload;
      })
      // Create ticket
      .addCase(createTicket.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets.push(action.payload);
        state.error = null;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update ticket
      .addCase(updateTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
        if (state.selectedTicket?.id === action.payload.id) {
          state.selectedTicket = action.payload;
        }
      })
      // Delete ticket
      .addCase(deleteTicket.fulfilled, (state, action) => {
        state.tickets = state.tickets.filter(t => t.id !== action.payload);
        if (state.selectedTicket?.id === action.payload) {
          state.selectedTicket = null;
        }
      })
      // Fetch users
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = Array.isArray(action.payload) ? action.payload : [];
      });
  },
});

export const { selectTicket, clearError, setFilters, clearFilters } = ticketSlice.actions;
export default ticketSlice.reducer;