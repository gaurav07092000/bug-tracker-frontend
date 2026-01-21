This is a Bug Tracking System frontend built with React.js, Vite, Redux Toolkit, and Tailwind CSS.

## Project Overview

This frontend application provides a comprehensive bug tracking and project management interface with the following features:

### Core Features
- **Authentication**: Secure login/register with JWT token management
- **Project Management**: Create, view, edit, and delete projects (admin only)
- **Ticket Management**: Create, edit, assign, and track bug tickets with types, priorities, and time tracking
- **Search & Filtering**: Advanced filtering by status, priority, assignee, and type
- **Role-Based Access**: Different permissions for ADMIN and USER roles
- **Responsive Design**: Mobile-first design using Tailwind CSS

### Tech Stack
- React 18 with hooks and functional components
- Vite for fast development and building
- Redux Toolkit for state management
- React Router for client-side routing
- Tailwind CSS for styling
- Axios for API communication

### Architecture
- Clean component structure with separation of concerns
- Custom hooks for reusable logic
- Centralized API service layer with response interceptors
- Utility functions for common operations
- Constants for consistent data handling

### API Configuration
- Backend API URL: http://localhost:5000/api
- Standard response format with success/data wrapper
- JWT token-based authentication
- Role-based permission system (USER/ADMIN)

### Key Files
- `src/App.jsx` - Main application with routing
- `src/store/` - Redux store and slices
- `src/services/api.js` - Centralized API service
- `src/components/` - Reusable UI components
- `src/pages/` - Page-level components
- `src/utils/` - Utility functions and constants

The application is ready to connect with a Node.js backend API running on port 5000.