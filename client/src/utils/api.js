/**
 * API utility functions
 */

/**
 * Base API URL
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Default headers for API requests
 */
const defaultHeaders = {
  'Content-Type': 'application/json',
};

/**
 * Creates headers with authentication token
 * @param {string} token - Authentication token
 * @returns {Object} - Headers object
 */
const createAuthHeaders = (token) => ({
  ...defaultHeaders,
  Authorization: `Bearer ${token}`,
});

/**
 * Handles API response
 * @param {Response} response - Fetch response
 * @returns {Promise} - Parsed response data
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API request failed');
  }
  return response.json();
};

/**
 * Makes an API request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - API response
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  const headers = token ? createAuthHeaders(token) : defaultHeaders;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Makes a GET request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - API response
 */
export const get = (endpoint, options = {}) => {
  return apiRequest(endpoint, { ...options, method: 'GET' });
};

/**
 * Makes a POST request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request data
 * @param {Object} options - Fetch options
 * @returns {Promise} - API response
 */
export const post = (endpoint, data, options = {}) => {
  return apiRequest(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Makes a PUT request
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Request data
 * @param {Object} options - Fetch options
 * @returns {Promise} - API response
 */
export const put = (endpoint, data, options = {}) => {
  return apiRequest(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

/**
 * Makes a DELETE request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - API response
 */
export const del = (endpoint, options = {}) => {
  return apiRequest(endpoint, { ...options, method: 'DELETE' });
};

/**
 * Uploads a file
 * @param {string} endpoint - API endpoint
 * @param {File} file - File to upload
 * @param {Object} options - Fetch options
 * @returns {Promise} - API response
 */
export const uploadFile = async (endpoint, file, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  const headers = token ? createAuthHeaders(token) : {};

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers,
      body: formData,
    });

    return handleResponse(response);
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
}; 