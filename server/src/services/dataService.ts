// DEPRECATED: This file used to provide mock data from JSON. Do not use in production. Use Prisma/database instead.

import { User, Reward, Receipt, Metrics } from '../types';
import { ApiError } from '../utils/ApiError';
import { logger } from '../utils/logger';

// Load data from JSON file
const loadData = () => {
  try {
    return require('../../data.json');
  } catch (error) {
    logger.error('Error loading data:', error);
    throw new ApiError('Failed to load data', 500, 'DATA_LOAD_ERROR');
  }
};

// User operations
export const getUserById = (id: string): User => {
  const data = loadData();
  const user = data.users.find((u: User) => u.id === id);
  if (!user) {
    throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
  }
  return user;
};

export const getAllUsers = (): User[] => {
  const data = loadData();
  return data.users;
};

export const updateUserPoints = (id: string, pointsOrCallback: number | ((user: User) => number)): User => {
  const data = loadData();
  const user = data.users.find((u: User) => u.id === id);
  if (!user) {
    throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
  }
  
  if (typeof pointsOrCallback === 'function') {
    user.points = pointsOrCallback(user);
  } else {
    user.points = pointsOrCallback;
  }
  
  return user;
};

// Reward operations
export const getRewardById = (id: string): Reward => {
  const data = loadData();
  const reward = data.rewards.find((r: Reward) => r.id === id);
  if (!reward) {
    throw new ApiError('Reward not found', 404, 'REWARD_NOT_FOUND');
  }
  return reward;
};

export const getAllRewards = (): Reward[] => {
  const data = loadData();
  return data.rewards;
};

// Receipt operations
export const getAllReceipts = (): Receipt[] => {
  const data = loadData();
  return data.receipts;
};

// Metrics operations
export const getMetrics = (): Metrics => {
  const data = loadData();
  return data.metrics;
}; 