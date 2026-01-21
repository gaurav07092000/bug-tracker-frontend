import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectAPI } from '../../services/api';

// Async thunks
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectAPI.getAll();
      return response.data?.projects || response.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await projectAPI.create(projectData);
      return response.data?.project || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create project');
    }
  }
);

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const response = await projectAPI.update(id, projectData);
      return response.data?.project || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update project');
    }
  }
);

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await projectAPI.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete project');
    }
  }
);

export const addProjectMember = createAsyncThunk(
  'projects/addMember',
  async ({ projectId, userId, role }, { rejectWithValue, getState }) => {
    try {
      const response = await projectAPI.addMember(projectId, userId, role);
      
      const state = getState();
      const users = state.tickets.users || [];
      const user = users.find(u => (u._id || u.id) === userId);
      
      const member = response.data?.member || response.data || {
        user: user || { _id: userId, name: 'Unknown', email: '' },
        role: role
      };
      
      return { projectId, member, userId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add member');
    }
  }
);

export const removeProjectMember = createAsyncThunk(
  'projects/removeMember',
  async ({ projectId, userId }, { rejectWithValue }) => {
    try {
      await projectAPI.removeMember(projectId, userId);
      return { projectId, userId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove member');
    }
  }
);

const initialState = {
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    selectProject: (state, action) => {
      state.selectedProject = action.payload;
    },
    clearSelection: (state) => {
      state.selectedProject = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.projects = [];
        state.error = action.payload;
      })
      // Create project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.selectedProject?.id === action.payload.id) {
          state.selectedProject = action.payload;
        }
      })
      // Delete project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(p => (p._id || p.id) !== action.payload);
        if ((state.selectedProject?._id || state.selectedProject?.id) === action.payload) {
          state.selectedProject = null;
        }
      })
      // Add project member
      .addCase(addProjectMember.fulfilled, (state, action) => {
        const { projectId, member } = action.payload;
        const project = state.projects.find(p => (p._id || p.id) === projectId);
        if (project) {
          project.members = project.members || [];
          project.members.push(member);
        }
        if (state.selectedProject && (state.selectedProject._id || state.selectedProject.id) === projectId) {
          state.selectedProject.members = state.selectedProject.members || [];
          state.selectedProject.members.push(member);
        }
      })
      // Remove project member
      .addCase(removeProjectMember.fulfilled, (state, action) => {
        const { projectId, userId } = action.payload;
        const project = state.projects.find(p => (p._id || p.id) === projectId);
        if (project && project.members) {
          project.members = project.members.filter(m => {
            const memberId = m.user?._id || m.user?.id || m.userId || m._id || m.id;
            return memberId !== userId;
          });
        }
        if (state.selectedProject && (state.selectedProject._id || state.selectedProject.id) === projectId) {
          if (state.selectedProject.members) {
            state.selectedProject.members = state.selectedProject.members.filter(m => {
              const memberId = m.user?._id || m.user?.id || m.userId || m._id || m.id;
              return memberId !== userId;
            });
          }
        }
      });
  },
});

export const { selectProject, clearSelection, clearError } = projectSlice.actions;
export default projectSlice.reducer;