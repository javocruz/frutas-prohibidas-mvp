import { Router } from 'express';
import { z } from 'zod';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';
import { getAllRewards, getRewardById, updateUserPoints } from '../services/dataService';

const router = Router();

// Validation schemas
const redeemSchema = z.object({
  userId: z.string(),
});

// Get all rewards
router.get('/', (req, res) => {
  try {
    const rewards = getAllRewards();
    res.json({ success: true, data: rewards });
  } catch (error) {
    logger.error('Error fetching rewards:', error);
    throw new ApiError('Failed to fetch rewards', 500, 'FETCH_REWARDS_ERROR');
  }
});

// Redeem a reward
router.post('/:rewardId/redeem', (req, res) => {
  try {
    const { rewardId } = req.params;
    const validation = redeemSchema.safeParse(req.body);
    
    if (!validation.success) {
      throw new ApiError('Invalid userId', 400, 'INVALID_USER_ID');
    }

    const { userId } = validation.data;
    const reward = getRewardById(rewardId);
    const user = updateUserPoints(userId, (user) => {
      if (user.points < reward.pointsCost) {
        throw new ApiError('Not enough points', 400, 'NOT_ENOUGH_POINTS');
      }
      return user.points - reward.pointsCost;
    });

    res.json({ success: true, data: { remainingPoints: user.points } });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error('Error redeeming reward:', error);
    throw new ApiError('Failed to redeem reward', 500, 'REDEEM_REWARD_ERROR');
  }
});

export default router; 