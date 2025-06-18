import express from 'express';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';
import { getAllReceipts } from '../services/dataService';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { generateReceiptCode } from '../utils/receiptCode';
import { Request, Response } from 'express';

const router = express.Router();

// Validation schema for receipt items
const receiptItemSchema = z.object({
  menu_item_id: z.number(),
  quantity: z.number().min(1).max(99),
});

// Validation schema for creating a receipt
const createReceiptSchema = z.object({
  items: z.array(receiptItemSchema).min(1),
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
router.post('/finalize', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = createReceiptSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Invalid request data',
        details: validationResult.error.errors,
      });
    }

    const { items } = validationResult.data;

    // Validate menu items exist and get their details
    const menuItemIds = items.map(item => item.menu_item_id);
    const existingItems = await prisma.menu_items.findMany({
      where: { id: { in: menuItemIds } }
    });

    if (existingItems.length !== menuItemIds.length) {
      const missingIds = menuItemIds.filter(
        id => !existingItems.some(item => item.id === id)
      );
      return res.status(400).json({
        error: 'One or more menu items not found',
        missingItems: missingIds,
      });
    }

    // Check for duplicate menu items
    const uniqueItems = new Set(items.map(item => item.menu_item_id));
    if (uniqueItems.size !== items.length) {
      return res.status(400).json({
        error: 'Duplicate menu items are not allowed',
      });
    }

    // Generate a unique receipt code with retry logic
    let receipt_code;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      receipt_code = await generateReceiptCode();
      const existingReceipt = await prisma.receipts.findUnique({
        where: { receipt_code },
      });
      if (!existingReceipt) break;
      attempts++;
    }

    if (!receipt_code) {
      throw new Error('Failed to generate unique receipt code');
    }

    // Calculate totals and points
    const totals = items.reduce(
      (acc, item) => {
        const menuItem = existingItems.find(mi => mi.id === item.menu_item_id);
        if (!menuItem) return acc;
        return {
          co2: acc.co2 + (Number(menuItem.co2_saved) * item.quantity),
          water: acc.water + (menuItem.water_saved * item.quantity),
          land: acc.land + (Number(menuItem.land_saved) * item.quantity),
        };
      },
      { co2: 0, water: 0, land: 0 }
    );

    const points_earned = calculatePoints(totals.co2, totals.water, totals.land);

    // Create the receipt with items in a transaction
    const receipt = await prisma.$transaction(async (tx) => {
      // Create the receipt
      const newReceipt = await tx.receipts.create({
        data: {
          receipt_code,
          total_co2_saved: Number(totals.co2),
          total_water_saved: Number(totals.water),
          total_land_saved: Number(totals.land),
          points_earned,
          created_at: new Date(),
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

      return newReceipt;
    });

    res.json({
      receipt_code: receipt.receipt_code,
      points_earned: receipt.points_earned,
      created_at: receipt.created_at,
      total_co2_saved: receipt.total_co2_saved,
      total_water_saved: receipt.total_water_saved,
      total_land_saved: receipt.total_land_saved,
    });
  } catch (error) {
    console.error('Error creating receipt:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors,
      });
    }
    res.status(500).json({
      error: 'Failed to create receipt',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Get all receipts
router.get('/', async (req: Request, res: Response) => {
  try {
    const receipts = await prisma.receipts.findMany({
      include: {
        receipt_items: {
          include: {
            menu_items: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    res.json(receipts);
  } catch (error) {
    logger.error('Error fetching receipts:', error);
    res.status(500).json({ error: 'Failed to fetch receipts' });
  }
});

// Get a receipt by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const receipt = await prisma.receipts.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        receipt_items: {
          include: {
            menu_items: true,
          },
        },
      },
    });

    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found' });
    }

    res.json(receipt);
  } catch (error) {
    logger.error('Error fetching receipt:', error);
    res.status(500).json({ error: 'Failed to fetch receipt' });
  }
});

// Claim a receipt by code
router.post('/claim', async (req: Request, res: Response) => {
  try {
    const { receipt_code, user_id } = req.body;

    if (!receipt_code || !user_id) {
      return res.status(400).json({ error: 'Receipt code and user ID are required' });
    }

    // Find the receipt by code
    const receipt = await prisma.receipts.findFirst({
      where: {
        receipt_code,
        user_id: null, // Only unclaimed receipts
      },
      include: {
        receipt_items: {
          include: {
            menu_items: true,
          },
        },
      },
    });

    if (!receipt) {
      return res.status(404).json({ error: 'Receipt not found or already claimed' });
    }

    // Update the receipt with the user ID and update user points
    const updatedReceipt = await prisma.$transaction(async (tx) => {
      // Update the receipt
      const updatedReceipt = await tx.receipts.update({
        where: {
          id: receipt.id,
        },
        data: {
          user_id,
        },
        include: {
          receipt_items: {
            include: {
              menu_items: true,
            },
          },
        },
      });

      // Update user points
      await tx.users.update({
        where: {
          id: user_id,
        },
        data: {
          points: {
            increment: receipt.points_earned,
          },
        },
      });

      return updatedReceipt;
    });

    res.json({
      success: true,
      data: updatedReceipt,
    });
  } catch (error) {
    console.error('Error claiming receipt:', error);
    res.status(500).json({ error: 'Failed to claim receipt' });
  }
});

// Get all receipts for a specific user
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
    res.json(receipts);
  } catch (error) {
    console.error('Error fetching user receipts:', error);
    res.status(500).json({ error: 'Failed to fetch user receipts' });
  }
});

// Delete a receipt by code
router.delete('/code/:code', async (req: Request, res: Response) => {
  try {
    const { code } = req.params;
    const deleted = await prisma.receipts.delete({
      where: { receipt_code: code }
    });
    res.json({ success: true, deleted });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete receipt' });
  }
});

export default router; 