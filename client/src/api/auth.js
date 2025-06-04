import { post } from './api';

/**
 * Authentication API endpoints
 */
const AUTH_ENDPOINTS = {
  login: '/auth/login',
  register: '/auth/register',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  verifyEmail: '/auth/verify-email',
};

/**
 * Authenticates a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<object>} User data
 */
export const login = async (email, password) => {
  try {
    // For development, simulate API call with mock data
    if (email === 'example@gmail.com' && password === '12345678') {
      return {
        id: 'user-1',
        name: 'John Doe',
        email: 'example@gmail.com',
        points: 1200,
        role: 'admin'
      };
    }
    throw new Error('Invalid credentials');
  } catch (error) {
    throw new Error(error.message || 'Failed to login');
  }
};

/**
 * Registers a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - User data and token
 */
export const register = async (userData) => {
  const response = await post(AUTH_ENDPOINTS.register, userData);
  if (response.token) {
    localStorage.setItem('token', response.token);
  }
  return response;
};

/**
 * Logs out the current user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  // In a real app, this would call the API to invalidate the session
  return Promise.resolve();
};

/**
 * Refreshes the authentication token
 * @returns {Promise<Object>} - New token
 */
export const refreshToken = async () => {
  const response = await post(AUTH_ENDPOINTS.refresh);
  if (response.token) {
    localStorage.setItem('token', response.token);
  }
  return response;
};

/**
 * Requests a password reset email
 * @param {string} email - User's email
 * @returns {Promise<void>}
 */
export const forgotPassword = async (email) => {
  return post(AUTH_ENDPOINTS.forgotPassword, { email });
};

/**
 * Resets a user's password
 * @param {string} token - Reset token
 * @param {string} password - New password
 * @returns {Promise<void>}
 */
export const resetPassword = async (token, password) => {
  return post(AUTH_ENDPOINTS.resetPassword, { token, password });
};

/**
 * Verifies a user's email
 * @param {string} token - Verification token
 * @returns {Promise<void>}
 */
export const verifyEmail = async (token) => {
  return post(AUTH_ENDPOINTS.verifyEmail, { token });
}; 