import { Router } from 'express';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';
import { getAllReceipts } from '../services/dataService';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const router = Router();

// Validation schema for receipt items
const receiptItemSchema = z.object({
  menu_item_id: z.number(),
  quantity: z.number().int().positive(),
});

// Validation schema for creating a receipt
const createReceiptSchema = z.object({
  user_id: z.string().uuid(),
  items: z.array(receiptItemSchema),
  image_url: z.string().optional(),
});

// Calculate points based on environmental impact
const calculatePoints = (co2Saved: number, waterSaved: number, landSaved: number): number => {
  // Base points for each metric
  const CO2_POINTS_PER_KG = 100;  // 100 points per kg of CO2 saved
  const WATER_POINTS_PER_L = 1;   // 1 point per liter of water saved
  const LAND_POINTS_PER_M2 = 50;  // 50 points per m² of land saved

  return Math.round(
    (co2Saved * CO2_POINTS_PER_KG) +
    (waterSaved * WATER_POINTS_PER_L) +
    (landSaved * LAND_POINTS_PER_M2)
  );
};

// Create a new receipt
router.post('/', async (req, res) => {
  try {
    const validation = createReceiptSchema.safeParse(req.body);
    if (!validation.success) {
      throw new ApiError('Invalid receipt data', 400, 'INVALID_RECEIPT_DATA');
    }

    const { user_id, items, image_url } = validation.data;

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      let totalCo2Saved = 0;
      let totalWaterSaved = 0;
      let totalLandSaved = 0;

      // Calculate totals and validate menu items
      for (const item of items) {
        const menuItem = await tx.menu_items.findUnique({
          where: { id: item.menu_item_id },
        });

        if (!menuItem) {
          throw new ApiError(`Menu item ${item.menu_item_id} not found`, 404, 'MENU_ITEM_NOT_FOUND');
        }

        totalCo2Saved += Number(menuItem.co2_saved) * item.quantity;
        totalWaterSaved += menuItem.water_saved * item.quantity;
        totalLandSaved += Number(menuItem.land_saved) * item.quantity;
      }

      // Calculate points based on environmental impact
      const pointsEarned = calculatePoints(totalCo2Saved, totalWaterSaved, totalLandSaved);

      // Create the receipt
      const receipt = await tx.receipts.create({
        data: {
          user_id,
          total_co2_saved: totalCo2Saved,
          total_water_saved: totalWaterSaved,
          total_land_saved: totalLandSaved,
          points_earned: pointsEarned,
          image_url,
          receipt_items: {
            create: items.map(item => ({
              menu_item_id: item.menu_item_id,
              quantity: item.quantity,
            })),
          },
        },
        include: {
          receipt_items: {
            include: {
              menu_items: true,
            },
          },
        },
      });

      // Update user's total points
      await tx.users.update({
        where: { id: user_id },
        data: {
          points: {
            increment: pointsEarned,
          },
        },
      });

      return receipt;
    });

    res.json(result);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error('Error creating receipt:', error);
    throw new ApiError('Failed to create receipt', 500, 'CREATE_RECEIPT_ERROR');
  }
});

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
        user_id: req.params.userId
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
    res.status(500).json({ 
      error: 'Failed to fetch receipts', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router; 