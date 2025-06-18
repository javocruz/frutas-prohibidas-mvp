import express from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';
import { prisma } from '../lib/prisma';

const router = express.Router();

// Validation schemas
const updatePointsSchema = z.object({
  points: z.number().min(0),
});

const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
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

// Update user profile
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = updateProfileSchema.parse(req.body);

    const user = await prisma.users.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
      },
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Change password
router.put('/:id/password', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);

    // TODO: Implement password change logic with Supabase
    // This is a placeholder for now
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
});

export default router; 