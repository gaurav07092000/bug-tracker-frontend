import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loadUserFromStorage } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Load user from localStorage on app start
    if (!user && !isAuthenticated) {
      dispatch(loadUserFromStorage());
    }
  }, [dispatch, user, isAuthenticated]);

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
  };
};