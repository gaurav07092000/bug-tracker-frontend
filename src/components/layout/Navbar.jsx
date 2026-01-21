import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { logoutUser } from '../../store/slices/authSlice';
import { isAdmin } from '../../utils/helpers';
import Button from '../ui/Button';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-blue-600">
                  BugTracker
                </h1>
              </div>
            </Link>
            
            <div className="ml-10 flex space-x-8">
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive('/dashboard')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </Link>
              
              {isAdmin(user) && (
                <Link
                  to="/projects"
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive('/projects')
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Projects
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Welcome, {user?.name}
            </span>
            
            {isAdmin(user) && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                Admin
              </span>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;