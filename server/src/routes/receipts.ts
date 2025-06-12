import { Router } from 'express';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';
import { getAllReceipts } from '../services/dataService';
import { prisma } from '../lib/prisma';

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

// Get a receipt by ID with its items and menu item details
router.get('/:id', async (req, res) => {
  try {
    const receipt = await prisma.receipts.findUnique({
      where: { id: req.params.id },
      include: {
        receipt_items: {
          include: {
            menu_items: true,
          },
        },
        users: true,
      },
    });
    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found' });
    }
    res.json(receipt);
  } catch (error) {
    console.error('Error fetching receipt:', error);
    res.status(500).json({ error: 'Failed to fetch receipt' });
  }
});

// Get all receipts for a user, including items and menu item details
router.get('/user/:userId', async (req, res) => {
  try {
    const receipts = await prisma.receipts.findMany({
      where: { 
        user_id: req.params.userId,
        user_id: { not: null }
      },
      include: {
        receipt_items: {
          include: {
            menu_items: true,
          },
        },
        users: true,
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(receipts);
  } catch (error) {
    console.error('Error fetching receipts for user:', error);
    res.status(500).json({ error: 'Failed to fetch receipts', details: error.message });
  }
});

export default router; 