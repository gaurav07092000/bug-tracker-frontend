import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, clearError } from '../../store/slices/authSlice';
import { isValidEmail } from '../../utils/helpers';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (!validateForm()) {
      return;
    }

    setErrors({});
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        
        navigate('/dashboard');
      } else {
        setErrors({ general: data.message || 'Login failed' });
      }
    } catch (error) {
      setErrors({ general: 'Network error occurred. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Sign in to BugTracker
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Track and manage your project issues
            </p>
          </div>

          {(error || errors.general) && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <div className="text-sm text-red-600">
                {error || errors.general || 'Login failed. Please check your credentials.'}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              error={errors.email}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              error={errors.password}
              required
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
            />

            <button
              type="button"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;