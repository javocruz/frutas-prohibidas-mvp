import { Router } from 'express';
import { z } from 'zod';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';
import { getAllUsers } from '../services/dataService';
import { prisma } from '../lib/prisma';

const router = Router();

// Validation schemas
const updatePointsSchema = z.object({
  points: z.number().min(0),
});

// Get all users
router.get('/', (req, res) => {
  try {
    const users = getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    logger.error('Error fetching users:', error);
    throw new ApiError('Failed to fetch users', 500, 'FETCH_USERS_ERROR');
  }
});

// Update user points
router.post('/:id/points', async (req, res) => {
  try {
    const { id } = req.params;
    const validation = updatePointsSchema.safeParse(req.body);
    
    if (!validation.success) {
      throw new ApiError('Invalid points value', 400, 'INVALID_POINTS');
    }

    const { points } = validation.data;
    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) throw new ApiError('User not found', 404, 'USER_NOT_FOUND');
    const updatedUser = await prisma.users.update({
      where: { id },
      data: { points },
    });
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error('Error updating user points:', error);
    throw new ApiError('Failed to update points', 500, 'UPDATE_POINTS_ERROR');
  }
});

export default router; 