"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetrics = exports.getAllReceipts = exports.getAllRewards = exports.getRewardById = exports.updateUserPoints = exports.getAllUsers = exports.getUserById = void 0;
const ApiError_1 = require("../utils/ApiError");
const logger_1 = require("../utils/logger");
// Load data from JSON file
const loadData = () => {
    try {
        return require('../../data.json');
    }
    catch (error) {
        logger_1.logger.error('Error loading data:', error);
        throw new ApiError_1.ApiError('Failed to load data', 500, 'DATA_LOAD_ERROR');
    }
};
// User operations
const getUserById = (id) => {
    const data = loadData();
    const user = data.users.find((u) => u.id === id);
    if (!user) {
        throw new ApiError_1.ApiError('User not found', 404, 'USER_NOT_FOUND');
    }
    return user;
};
exports.getUserById = getUserById;
const getAllUsers = () => {
    const data = loadData();
    return data.users;
};
exports.getAllUsers = getAllUsers;
const updateUserPoints = (id, pointsOrCallback) => {
    const data = loadData();
    const user = data.users.find((u) => u.id === id);
    if (!user) {
        throw new ApiError_1.ApiError('User not found', 404, 'USER_NOT_FOUND');
    }
    if (typeof pointsOrCallback === 'function') {
        user.points = pointsOrCallback(user);
    }
    else {
        user.points = pointsOrCallback;
    }
    return user;
};
exports.updateUserPoints = updateUserPoints;
// Reward operations
const getRewardById = (id) => {
    const data = loadData();
    const reward = data.rewards.find((r) => r.id === id);
    if (!reward) {
        throw new ApiError_1.ApiError('Reward not found', 404, 'REWARD_NOT_FOUND');
    }
    return reward;
};
exports.getRewardById = getRewardById;
const getAllRewards = () => {
    const data = loadData();
    return data.rewards;
};
exports.getAllRewards = getAllRewards;
// Receipt operations
const getAllReceipts = () => {
    const data = loadData();
    return data.receipts;
};
exports.getAllReceipts = getAllReceipts;
// Metrics operations
const getMetrics = () => {
    const data = loadData();
    return data.metrics;
};
exports.getMetrics = getMetrics;
