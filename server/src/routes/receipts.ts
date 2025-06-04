import { Router } from 'express';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';
import { getAllReceipts } from '../services/dataService';

const router = Router();

// Get all receipts
router.get('/', (req, res) => {
  try {
    const receipts = getAllReceipts();
    res.json({ success: true, data: receipts });
  } catch (error) {
    logger.error('Error fetching receipts:', error);
    throw new ApiError('Failed to fetch receipts', 500, 'FETCH_RECEIPTS_ERROR');
  }
});

export default router; 