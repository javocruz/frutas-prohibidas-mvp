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
    // Aggregate metrics for this user from receipts
    const receipts = await prisma.receipts.findMany({
      where: { user_id: userId },
      select: {
        total_co2_saved: true,
        total_water_saved: true,
        total_land_saved: true,
        points_earned: true,
      },
    });
    const totalCo2Saved = receipts.reduce((sum, r) => sum + Number(r.total_co2_saved), 0);
    const totalWaterSaved = receipts.reduce((sum, r) => sum + Number(r.total_water_saved), 0);
    const totalLandSaved = receipts.reduce((sum, r) => sum + Number(r.total_land_saved), 0);
    const totalPoints = receipts.reduce((sum, r) => sum + Number(r.points_earned), 0);
    res.json({
      co2Saved: totalCo2Saved,
      waterSaved: totalWaterSaved,
      landSaved: totalLandSaved,
      points: totalPoints,
    });
  } catch (error) {
    console.error('Error fetching user metrics:', error);
    res.status(500).json({ error: 'Failed to fetch user metrics' });
  }
});

export default router; 