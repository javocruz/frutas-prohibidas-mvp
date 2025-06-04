"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const logger_1 = require("../utils/logger");
const ApiError_1 = require("../utils/ApiError");
const dataService_1 = require("../services/dataService");
const router = (0, express_1.Router)();
// Validation schemas
const redeemSchema = zod_1.z.object({
    userId: zod_1.z.string(),
});
// Get all rewards
router.get('/', (req, res) => {
    try {
        const rewards = (0, dataService_1.getAllRewards)();
        res.json({ success: true, data: rewards });
    }
    catch (error) {
        logger_1.logger.error('Error fetching rewards:', error);
        throw new ApiError_1.ApiError('Failed to fetch rewards', 500, 'FETCH_REWARDS_ERROR');
    }
});
// Redeem a reward
router.post('/:rewardId/redeem', (req, res) => {
    try {
        const { rewardId } = req.params;
        const validation = redeemSchema.safeParse(req.body);
        if (!validation.success) {
            throw new ApiError_1.ApiError('Invalid userId', 400, 'INVALID_USER_ID');
        }
        const { userId } = validation.data;
        const reward = (0, dataService_1.getRewardById)(rewardId);
        const user = (0, dataService_1.updateUserPoints)(userId, (user) => {
            if (user.points < reward.pointsCost) {
                throw new ApiError_1.ApiError('Not enough points', 400, 'NOT_ENOUGH_POINTS');
            }
            return user.points - reward.pointsCost;
        });
        res.json({ success: true, data: { remainingPoints: user.points } });
    }
    catch (error) {
        if (error instanceof ApiError_1.ApiError)
            throw error;
        logger_1.logger.error('Error redeeming reward:', error);
        throw new ApiError_1.ApiError('Failed to redeem reward', 500, 'REDEEM_REWARD_ERROR');
    }
});
exports.default = router;
