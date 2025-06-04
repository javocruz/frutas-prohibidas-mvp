/**
 * Basic HTTP request functions for API calls
 */

const BASE_URL = 'http://localhost:3000/api';

/**
 * Makes a GET request to the specified endpoint
 * @param {string} endpoint - The API endpoint
 * @returns {Promise<any>} The response data
 */
export const get = async (endpoint) => {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Makes a POST request to the specified endpoint
 * @param {string} endpoint - The API endpoint
 * @param {object} data - The data to send
 * @returns {Promise<any>} The response data
 */
export const post = async (endpoint, data) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Makes a PUT request to the specified endpoint
 * @param {string} endpoint - The API endpoint
 * @param {object} data - The data to send
 * @returns {Promise<any>} The response data
 */
export const put = async (endpoint, data) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Makes a DELETE request to the specified endpoint
 * @param {string} endpoint - The API endpoint
 * @returns {Promise<any>} The response data
 */
export const del = async (endpoint) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}; 