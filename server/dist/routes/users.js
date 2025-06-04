"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const logger_1 = require("../utils/logger");
const ApiError_1 = require("../utils/ApiError");
const dataService_1 = require("../services/dataService");
const router = (0, express_1.Router)();
// Validation schemas
const updatePointsSchema = zod_1.z.object({
    points: zod_1.z.number().min(0),
});
// Get all users
router.get('/', (req, res) => {
    try {
        const users = (0, dataService_1.getAllUsers)();
        res.json({ success: true, data: users });
    }
    catch (error) {
        logger_1.logger.error('Error fetching users:', error);
        throw new ApiError_1.ApiError('Failed to fetch users', 500, 'FETCH_USERS_ERROR');
    }
});
// Update user points
router.post('/:id/points', (req, res) => {
    try {
        const { id } = req.params;
        const validation = updatePointsSchema.safeParse(req.body);
        if (!validation.success) {
            throw new ApiError_1.ApiError('Invalid points value', 400, 'INVALID_POINTS');
        }
        const { points } = validation.data;
        const user = (0, dataService_1.updateUserPoints)(id, points);
        res.json({ success: true, data: user });
    }
    catch (error) {
        if (error instanceof ApiError_1.ApiError)
            throw error;
        logger_1.logger.error('Error updating user points:', error);
        throw new ApiError_1.ApiError('Failed to update points', 500, 'UPDATE_POINTS_ERROR');
    }
});
exports.default = router;
