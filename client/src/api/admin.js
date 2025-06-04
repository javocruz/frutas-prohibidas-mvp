import { get, post, put, del } from '../utils/api';

const ADMIN_ENDPOINTS = {
  users: '/admin/users',
  user: (id) => `/admin/users/${id}`,
  settings: '/admin/settings',
};

/**
 * Fetch all users
 * @returns {Promise<Array>} List of users
 */
export const fetchUsers = async () => {
  return get(ADMIN_ENDPOINTS.users);
};

/**
 * Fetch a single user by ID
 * @param {string} id - User ID
 * @returns {Promise<Object>} User data
 */
export const fetchUser = async (id) => {
  return get(ADMIN_ENDPOINTS.user(id));
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
export const createUser = async (userData) => {
  return post(ADMIN_ENDPOINTS.users, userData);
};

/**
 * Update a user
 * @param {string} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user
 */
export const updateUser = async (id, userData) => {
  return put(ADMIN_ENDPOINTS.user(id), userData);
};

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise<void>}
 */
export const deleteUser = async (id) => {
  return del(ADMIN_ENDPOINTS.user(id));
};

/**
 * Update user points
 * @param {string} id - User ID
 * @param {number} points - New points value
 * @returns {Promise<Object>} Updated user
 */
export const updateUserPoints = async (id, points) => {
  return put(ADMIN_ENDPOINTS.user(id), { points });
};

/**
 * Update user role
 * @param {string} id - User ID
 * @param {string} role - New role
 * @returns {Promise<Object>} Updated user
 */
export const updateUserRole = async (id, role) => {
  return put(ADMIN_ENDPOINTS.user(id), { role });
};

/**
 * Update user status
 * @param {string} id - User ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated user
 */
export const updateUserStatus = async (id, status) => {
  return put(ADMIN_ENDPOINTS.user(id), { status });
};

/**
 * Fetch application settings
 * @returns {Promise<Object>} Application settings
 */
export const fetchSettings = async () => {
  return get(ADMIN_ENDPOINTS.settings);
};

/**
 * Update application settings
 * @param {Object} settings - New settings
 * @returns {Promise<Object>} Updated settings
 */
export const updateSettings = async (settings) => {
  return put(ADMIN_ENDPOINTS.settings, settings);
}; 