import { Router } from 'express';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';
import { getMetrics } from '../services/dataService';
import { prisma } from '../lib/prisma';
import { Request, Response } from 'express';

const router = Router();

// Get metrics
router.get('/', (req: Request, res: Response) => {
  try {
    const metrics = getMetrics();
    res.json({ success: true, data: metrics });
  } catch (error) {
    logger.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Get metrics for a specific user
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const receipts = await prisma.receipts.findMany({
      where: {
        user_id: userId
      },
      include: {
        receipt_items: {
          include: {
            menu_items: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    const totalCo2Saved = receipts.reduce((sum, receipt) => sum + Number(receipt.total_co2_saved), 0);
    const totalWaterSaved = receipts.reduce((sum, receipt) => sum + Number(receipt.total_water_saved), 0);
    const totalLandSaved = receipts.reduce((sum, receipt) => sum + Number(receipt.total_land_saved), 0);
    const totalPointsEarned = receipts.reduce((sum, receipt) => sum + Number(receipt.points_earned), 0);

    // Get recent receipts (last 5)
    const recentReceipts = receipts.slice(0, 5).map(receipt => ({
      id: receipt.id,
      createdAt: receipt.created_at,
      pointsEarned: receipt.points_earned,
      items: receipt.receipt_items.map(item => ({
        name: item.menu_items?.name || 'Unknown Item',
        quantity: item.quantity
      }))
    }));

    // Get recent rewards (last 5)
    const recentRewards = await prisma.user_rewards.findMany({
      where: {
        user_id: userId
      },
      include: {
        rewards: true
      },
      orderBy: {
        redeemed_at: 'desc'
      },
      take: 5
    });

    const formattedRewards = recentRewards.map(ur => ({
      id: ur.id,
      name: ur.rewards.name,
      description: ur.rewards.description,
      redeemedAt: ur.redeemed_at
    }));

    res.json({
      success: true,
      data: {
        totalCo2Saved,
        totalWaterSaved,
        totalLandSaved,
        totalPointsEarned,
        recentReceipts,
        recentRewards: formattedRewards
      }
    });
  } catch (error) {
    console.error('Error fetching user metrics:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch user metrics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router; 