import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

const router = Router();

// Validation schema for menu items
const menuItemSchema = z.object({
  category: z.string(),
  name: z.string(),
  co2_saved: z.number().positive(),
  water_saved: z.number().int().positive(),
  land_saved: z.number().positive(),
});

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const items = await prisma.menu_items.findMany({
      orderBy: { category: 'asc' },
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Get menu items by category
router.get('/category/:category', async (req, res) => {
  try {
    const items = await prisma.menu_items.findMany({
      where: { category: req.params.category },
      orderBy: { name: 'asc' },
    });
    res.json(items);
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// Create a new menu item
router.post('/', async (req, res) => {
  try {
    const validatedData = menuItemSchema.parse(req.body);
    const item = await prisma.menu_items.create({
      data: validatedData,
    });
    res.status(201).json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error creating menu item:', error);
      res.status(500).json({ error: 'Failed to create menu item' });
    }
  }
});

// Update a menu item
router.put('/:id', async (req, res) => {
  try {
    const validatedData = menuItemSchema.parse(req.body);
    const item = await prisma.menu_items.update({
      where: { id: parseInt(req.params.id) },
      data: validatedData,
    });
    res.json(item);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      console.error('Error updating menu item:', error);
      res.status(500).json({ error: 'Failed to update menu item' });
    }
  }
});

// Delete a menu item
router.delete('/:id', async (req, res) => {
  try {
    await prisma.menu_items.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

export default router; 