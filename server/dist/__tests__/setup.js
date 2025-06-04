"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockRewards = exports.mockUsers = void 0;
const dotenv_1 = require("dotenv");
// Load test environment variables
(0, dotenv_1.config)({ path: '.env.test' });
// Mock data for testing
exports.mockUsers = [
    { id: '1', name: 'Test User 1', points: 100, status: 'active' },
    { id: '2', name: 'Test User 2', points: 200, status: 'active' },
];
exports.mockRewards = [
    { id: '1', name: 'Test Reward 1', pointsCost: 50, description: 'Test Description 1' },
    { id: '2', name: 'Test Reward 2', pointsCost: 100, description: 'Test Description 2' },
];
// Mock the data.json file
jest.mock('../../data.json', () => require('./__mocks__/data.json'));
