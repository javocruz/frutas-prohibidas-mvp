import { get, post, put, del } from '../utils/api';

/**
 * Rewards API endpoints
 */
const REWARDS_ENDPOINTS = {
  list: '/rewards',
  create: '/rewards',
  get: (id) => `/rewards/${id}`,
  update: (id) => `/rewards/${id}`,
  delete: (id) => `/rewards/${id}`,
  redeem: (id) => `/rewards/${id}/redeem`,
  validate: '/rewards/validate',
};

/**
 * Fetches a list of rewards
 * @param {Object} params - Query parameters
 * @returns {Promise<Array>} - List of rewards
 */
export const fetchRewards = async (params = {}) => {
  return get(REWARDS_ENDPOINTS.list, { params });
};

/**
 * Fetches a single reward
 * @param {string} id - Reward ID
 * @returns {Promise<Object>} - Reward data
 */
export const fetchReward = async (id) => {
  return get(REWARDS_ENDPOINTS.get(id));
};

/**
 * Creates a new reward
 * @param {Object} rewardData - Reward data
 * @returns {Promise<Object>} - Created reward
 */
export const createReward = async (rewardData) => {
  return post(REWARDS_ENDPOINTS.create, rewardData);
};

/**
 * Updates a reward
 * @param {string} id - Reward ID
 * @param {Object} rewardData - Updated reward data
 * @returns {Promise<Object>} - Updated reward
 */
export const updateReward = async (id, rewardData) => {
  return put(REWARDS_ENDPOINTS.update(id), rewardData);
};

/**
 * Deletes a reward
 * @param {string} id - Reward ID
 * @returns {Promise<void>}
 */
export const deleteReward = async (id) => {
  return del(REWARDS_ENDPOINTS.delete(id));
};

/**
 * Redeems a reward
 * @param {string} id - Reward ID
 * @returns {Promise<Object>} - Redemption result
 */
export const redeemReward = async (id) => {
  return post(REWARDS_ENDPOINTS.redeem(id));
};

/**
 * Validates a reward
 * @param {Object} rewardData - Reward data to validate
 * @returns {Promise<Object>} - Validation result
 */
export const validateReward = async (rewardData) => {
  return post(REWARDS_ENDPOINTS.validate, rewardData);
}; 