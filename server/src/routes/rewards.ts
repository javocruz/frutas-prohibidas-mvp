import { Router } from 'express';
import { z } from 'zod';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';
import { prisma } from '../lib/prisma';

const router = Router();

// Validation schemas
const redeemSchema = z.object({
  user_id: z.string(),
});

// Get all rewards
router.get('/', async (req, res) => {
  try {
    const rewards = await prisma.rewards.findMany();
    res.json(rewards);
  } catch (error) {
    logger.error('Error fetching rewards:', error);
    res.status(500).json({ error: 'Failed to fetch rewards' });
  }
});

// Redeem a reward
router.post('/:rewardId/redeem', async (req, res) => {
  try {
    const { rewardId } = req.params;
    const validation = redeemSchema.safeParse(req.body);
    
    if (!validation.success) {
      throw new ApiError('Invalid user_id', 400, 'INVALID_USER_ID');
    }

    const { user_id } = validation.data;
    // Fetch reward and user from DB
    const reward = await prisma.rewards.findUnique({ where: { id: rewardId } });
    if (!reward) throw new ApiError('Reward not found', 404, 'REWARD_NOT_FOUND');
    const user = await prisma.users.findUnique({ where: { id: user_id } });
    if (!user) throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
    if (user.points < reward.points_required) {
      throw new ApiError('Not enough points', 400, 'NOT_ENOUGH_POINTS');
    }
    // Deduct points and create user_reward
    await prisma.users.update({
      where: { id: user_id },
      data: { points: user.points - reward.points_required },
    });
    await prisma.user_rewards.create({
      data: {
        user_id,
        reward_id: rewardId,
        redeemed_at: new Date().toISOString(),
      },
    });
    res.json({ success: true, data: { remaining_points: user.points - reward.points_required } });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error('Error redeeming reward:', error);
    throw new ApiError('Failed to redeem reward', 500, 'REDEEM_REWARD_ERROR');
  }
});

// Update rewards to set two of them to have a high point number
const rewards = [
  { id: '1', name: 'Reward 1', description: 'Description for Reward 1', points_required: 1000 },
  { id: '2', name: 'Reward 2', description: 'Description for Reward 2', points_required: 5000 },
  { id: '3', name: 'Reward 3', description: 'Description for Reward 3', points_required: 2000 },
  { id: '4', name: 'Reward 4', description: 'Description for Reward 4', points_required: 3000 },
  { id: '5', name: 'Reward 5', description: 'Description for Reward 5', points_required: 4000 },
];

export default router; 