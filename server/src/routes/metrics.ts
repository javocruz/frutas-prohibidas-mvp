import { Router } from 'express';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';
import { getMetrics } from '../services/dataService';

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

export default router; 