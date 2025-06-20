import { Router } from 'express';
import { z } from 'zod';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';
import { prisma } from '../lib/prisma';
import { protect } from '../middleware/auth';

const router = Router();

// Validation schemas (user_id is no longer needed from client)
const redeemSchema = z.object({});

// Get all rewards
router.get('/', async (req, res) => {
  try {
    const rewards = await prisma.rewards.findMany({
      where: { available: true }
    });
    res.json(rewards);
  } catch (error) {
    logger.error('Error fetching rewards:', error);
    res.status(500).json({ error: 'Failed to fetch rewards' });
  }
});

// Redeem a reward (Authenticated users)
router.post('/:rewardId/redeem', protect, async (req, res) => {
  try {
    const { rewardId } = req.params;
    const user = req.user; // Securely get user from 'protect' middleware

    if (!user) {
      throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
    }
    
    // Fetch reward and user from DB in a transaction
    const updatedUser = await prisma.$transaction(async (tx) => {
      const reward = await tx.rewards.findUnique({ where: { id: rewardId } });
      if (!reward) throw new ApiError('Reward not found', 404, 'REWARD_NOT_FOUND');
      
      const currentUser = await tx.users.findUnique({ where: { id: user.id } });
      if (!currentUser) throw new ApiError('User not found', 404, 'USER_NOT_FOUND');

      if (currentUser.points < reward.points_required) {
        throw new ApiError('Not enough points', 400, 'NOT_ENOUGH_POINTS');
      }

      // 1. Deduct points
      const newPoints = currentUser.points - reward.points_required;
      const updated = await tx.users.update({
        where: { id: user.id },
        data: { points: newPoints },
      });

      // 2. Create user_reward record
      await tx.user_rewards.create({
        data: {
          user_id: user.id,
          reward_id: rewardId,
          redeemed_at: new Date().toISOString(),
        },
      });

      return updated;
    });

    res.json({ success: true, data: { remaining_points: updatedUser.points } });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error('Error redeeming reward:', error);
    throw new ApiError('Failed to redeem reward', 500, 'REDEEM_REWARD_ERROR');
  }
});

export default router; 