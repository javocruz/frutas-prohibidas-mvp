import { get, post, put, del, uploadFile } from '../utils/api';

/**
 * Receipts API endpoints
 */
const RECEIPTS_ENDPOINTS = {
  list: '/receipts',
  create: '/receipts',
  get: (id) => `/receipts/${id}`,
  update: (id) => `/receipts/${id}`,
  delete: (id) => `/receipts/${id}`,
  upload: '/receipts/upload',
  validate: '/receipts/validate',
};

/**
 * Fetches a list of receipts
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} - List of receipts
 */
export const fetchReceipts = async (params = {}) => {
  return get(RECEIPTS_ENDPOINTS.list, { params });
};

/**
 * Fetches a single receipt
 * @param {string} id - Receipt ID
 * @returns {Promise<Object>} - Receipt data
 */
export const fetchReceipt = async (id) => {
  return get(RECEIPTS_ENDPOINTS.get(id));
};

/**
 * Creates a new receipt
 * @param {Object} receiptData - Receipt data
 * @returns {Promise<Object>} - Created receipt
 */
export const createReceipt = async (receiptData) => {
  return post(RECEIPTS_ENDPOINTS.create, receiptData);
};

/**
 * Updates a receipt
 * @param {string} id - Receipt ID
 * @param {Object} receiptData - Updated receipt data
 * @returns {Promise<Object>} - Updated receipt
 */
export const updateReceipt = async (id, receiptData) => {
  return put(RECEIPTS_ENDPOINTS.update(id), receiptData);
};

/**
 * Deletes a receipt
 * @param {string} id - Receipt ID
 * @returns {Promise<void>}
 */
export const deleteReceipt = async (id) => {
  return del(RECEIPTS_ENDPOINTS.delete(id));
};

/**
 * Uploads a receipt image
 * @param {File} file - Receipt image file
 * @returns {Promise<Object>} - Upload result
 */
export const uploadReceipt = async (file) => {
  return uploadFile(RECEIPTS_ENDPOINTS.upload, file);
};

/**
 * Validates a receipt
 * @param {Object} receiptData - Receipt data to validate
 * @returns {Promise<Object>} - Validation result
 */
export const validateReceipt = async (receiptData) => {
  return post(RECEIPTS_ENDPOINTS.validate, receiptData);
}; 