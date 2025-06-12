import { Router } from 'express';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';
import { getMetrics } from '../services/dataService';
import { prisma } from '../lib/prisma';

const router = Router();

// Get metrics
router.get('/', (req, res) => {
  try {
    const metrics = getMetrics();
    res.json({ success: true, data: metrics });
  } catch (error) {
    logger.error('Error fetching metrics:', error);
    throw new ApiError('Failed to fetch metrics', 500, 'FETCH_METRICS_ERROR');
  }
});

// Get metrics for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get user's total points and recent receipts
    const [user, receipts, redeemedRewards] = await Promise.all([
      prisma.users.findUnique({
        where: { id: userId },
        select: { points: true }
      }),
      prisma.receipts.findMany({
        where: { user_id: userId },
        orderBy: { created_at: 'desc' },
        take: 3,
        include: {
          receipt_items: {
            include: {
              menu_items: true
            }
          }
        }
      }),
      prisma.user_rewards.findMany({
        where: { user_id: userId },
        orderBy: { redeemed_at: 'desc' },
        take: 3,
        include: {
          rewards: true
        }
      })
    ]);

    // Calculate total environmental impact
    const totalImpact = await prisma.receipts.aggregate({
      where: { user_id: userId },
      _sum: {
        total_co2_saved: true,
        total_water_saved: true,
        total_land_saved: true,
        points_earned: true
      }
    });

    res.json({
      totalPoints: user?.points || 0,
      sustainabilityMetrics: {
        co2Saved: Number(totalImpact._sum.total_co2_saved) || 0,
        waterSaved: totalImpact._sum.total_water_saved || 0,
        landSaved: Number(totalImpact._sum.total_land_saved) || 0
      },
      recentReceipts: receipts.map(receipt => ({
        id: receipt.id,
        createdAt: receipt.created_at,
        pointsEarned: receipt.points_earned,
        items: receipt.receipt_items.map(item => ({
          name: item.menu_items?.name || 'Unknown Item',
          quantity: item.quantity
        }))
      })),
      recentRewards: redeemedRewards
        .filter(ur => ur.rewards !== null)
        .map(ur => ({
          id: ur.rewards!.id,
          name: ur.rewards!.name,
          description: ur.rewards!.description,
          redeemedAt: ur.redeemed_at
        }))
    });
  } catch (error) {
    logger.error('Error fetching user metrics:', error);
    throw new ApiError('Failed to fetch user metrics', 500, 'FETCH_USER_METRICS_ERROR');
  }
});

export default router; 