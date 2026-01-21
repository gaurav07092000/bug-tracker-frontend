# BugTracker Frontend

A modern React.js frontend application for the BugTracker system - a comprehensive bug tracking and project management tool.

## 🚀 Features

### Authentication & Authorization
- **User Authentication**: Secure login and registration
- **JWT Token Management**: Secure token-based authentication
- **Role-Based Access**: Admin and user role management
- **Protected Routes**: Route protection based on authentication status

### Project Management
- **Project Dashboard**: View and manage multiple projects
- **Project Creation**: Admin users can create new projects
- **Project Selection**: Easy project switching
- **Project Details**: Comprehensive project information

### Ticket Management
- **Ticket Creation**: Create detailed bug reports and feature requests
- **Ticket Editing**: Update ticket details, status, and priority
- **Ticket Assignment**: Assign tickets to team members
- **Ticket Status Tracking**: Track progress from Open to Closed
- **Priority Management**: Set and update ticket priorities (Low, Medium, High)

### Advanced Features
- **Search & Filtering**: Search tickets by title and filter by status, priority, and assignee
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Real-time Updates**: State management with Redux Toolkit
- **Loading States**: Comprehensive loading and error states
- **Toast Notifications**: User-friendly success and error messages

## 🛠 Tech Stack

- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Redux Toolkit**: State management with modern Redux patterns
- **React Router**: Client-side routing with protected routes
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication
- **React Toastify**: Toast notifications

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layout/         # Layout components (Navbar, Layout, ProtectedRoute)
│   ├── tickets/        # Ticket-related components
│   ├── projects/       # Project-related components
│   └── ui/             # Basic UI components (Button, Input, Modal, etc.)
├── pages/              # Page components
├── store/              # Redux store and slices
│   └── slices/         # Redux slices for different features
├── services/           # API services
├── hooks/              # Custom React hooks
├── utils/              # Utility functions and constants
└── styles.css          # Global styles with Tailwind
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Backend API server running on port 3000

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bug-tracker-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your backend API URL:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🎯 Usage

### User Registration/Login
1. Navigate to `/register` to create a new account
2. Or use `/login` to sign in with existing credentials
3. Upon successful authentication, you'll be redirected to the dashboard

### Project Management
1. **View Projects**: All projects are displayed on the dashboard
2. **Select Project**: Click on a project card to select it and view its tickets
3. **Create Project** (Admin only): Click "Create Project" to add a new project
4. **Edit/Delete Project** (Admin only): Use the action buttons on project cards

### Ticket Management
1. **View Tickets**: Select a project to view its tickets
2. **Create Ticket**: Click "Create Ticket" to add a new issue
3. **Filter Tickets**: Use the filter bar to search and filter tickets
4. **Edit Ticket**: Click "Edit" on any ticket you're assigned to or if you're an admin
5. **View Details**: Click "View" to see full ticket details

### Search and Filtering
- **Search**: Type in the search box to find tickets by title or description
- **Filter by Status**: Open, In Progress, Resolved, Closed
- **Filter by Priority**: Low, Medium, High
- **Filter by Assignee**: View tickets assigned to specific users
- **Clear Filters**: Remove all active filters at once

## 🎨 Design System

The application uses a consistent design system built with Tailwind CSS:

### Colors
- **Primary**: Blue (600/700 variants)
- **Status Colors**: 
  - Open: Blue
  - In Progress: Yellow
  - Resolved: Green
  - Closed: Gray
- **Priority Colors**:
  - Low: Gray
  - Medium: Yellow
  - High: Red

### Components
- **Buttons**: Multiple variants (primary, secondary, danger, outline)
- **Forms**: Consistent input fields with validation
- **Cards**: Clean card layouts for projects and tickets
- **Modals**: Responsive modal dialogs
- **Loading States**: Spinner components for async operations

## 🔐 Authentication Flow

1. **Token Storage**: JWT tokens are stored in localStorage
2. **Auto-Login**: Users remain logged in across browser sessions
3. **Token Refresh**: Automatic logout on token expiration
4. **Route Protection**: Unauthenticated users are redirected to login

## 🌐 API Integration

The frontend communicates with the backend through RESTful APIs:

- **Authentication**: `/api/auth/login`, `/api/auth/register`, `/api/auth/profile`
- **User Management**: `/api/auth/users` (admin operations)
- **Projects**: `/api/projects`
- **Tickets**: `/api/tickets`

### API Configuration

The application is configured to connect to `http://localhost:5000/api` by default. You can change this in the `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

### Data Structures

**Ticket Status Values:**
- `OPEN` - New tickets
- `IN_PROGRESS` - Tickets being worked on
- `RESOLVED` - Completed tickets awaiting verification
- `CLOSED` - Fully completed tickets

**Ticket Priorities:**
- `LOW` - Minor issues
- `MEDIUM` - Standard priority
- `HIGH` - Important issues

**Ticket Types:**
- `BUG` - Bug reports
- `FEATURE` - New feature requests
- `ENHANCEMENT` - Improvements to existing features
- `TASK` - General tasks

**User Roles:**
- `USER` - Regular user with limited permissions
- `ADMIN` - Administrator with full permissions

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized layout with collapsible sidebars
- **Mobile**: Touch-friendly interface with simplified navigation

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (recommended)
- **Component Structure**: Functional components with hooks
- **State Management**: Centralized state with Redux Toolkit

## 🔒 Security Features

- **XSS Protection**: Input sanitization and validation
- **CSRF Protection**: Token-based authentication
- **Secure Storage**: JWT tokens with proper expiration
- **Route Protection**: Authentication-based access control

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy loading for different routes
- **Memoization**: React.memo for expensive components
- **Bundle Optimization**: Vite's optimized bundling
- **Image Optimization**: Responsive images with proper formats

## 🐛 Known Issues & Limitations

- Activity history feature is planned for future implementation
- Real-time notifications require WebSocket integration
- File attachments for tickets not yet implemented

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of a Junior Full Stack Developer assessment and is for educational purposes.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Built with ❤️ using React.js and modern web technologies**