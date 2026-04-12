import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, removeUser } from '../redux/user/user.slice';
import { authService } from '../services';

export const useAuth = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      if (response.data) {
        dispatch(setUser(response.data));
      }
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      if (response.data) {
        dispatch(setUser(response.data));
      }
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await authService.logout();
      dispatch(removeUser());
    } catch (err) {
      setError(err.response?.data?.message || 'Logout failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgetPassword = async (emailData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.forgetPassword(emailData);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    login,
    logout,
    forgetPassword,
    loading,
    error,
  };
};
