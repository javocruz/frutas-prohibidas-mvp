import { Router } from 'express';
import { logger } from '../utils/logger';
import { ApiError } from '../utils/ApiError';
import { prisma } from '../lib/prisma';
import { Request, Response } from 'express';
import { protect, isAdmin } from '../middleware/auth';

const router = Router();

// Get metrics for a specific user (User or Admin)
router.get('/user/:userId', protect, async (req: Request, res: Response) => {
  const { userId } = req.params;
  const loggedInUser = req.user;

  // A user can only access their own metrics, unless they are an admin.
  if (loggedInUser?.id !== userId && loggedInUser?.user_metadata?.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Forbidden' });
  }

  try {
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

    const formattedRewards = recentRewards.map(ur => {
      if (!ur.rewards) return null;
      return {
        id: ur.id,
        name: ur.rewards.name,
        description: ur.rewards.description,
        redeemedAt: ur.redeemed_at
      }
    }).filter(Boolean);

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

// Get restaurant-wide metrics (Admin only)
router.get('/restaurant', protect, isAdmin, async (req: Request, res: Response) => {
  try {
    const receipts = await prisma.receipts.findMany();
    const totalCo2Saved = receipts.reduce((sum, receipt) => sum + Number(receipt.total_co2_saved || 0), 0);
    const totalWaterSaved = receipts.reduce((sum, receipt) => sum + Number(receipt.total_water_saved || 0), 0);
    const totalLandSaved = receipts.reduce((sum, receipt) => sum + Number(receipt.total_land_saved || 0), 0);
    res.json({
      success: true,
      data: {
        totalCo2Saved,
        totalWaterSaved,
        totalLandSaved
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch restaurant metrics' });
  }
});

// Admin Analytics Endpoint (Admin only)
router.get('/admin-analytics', protect, isAdmin, async (req: Request, res: Response) => {
  try {
    // 1. KPI Cards
    const [receipts, users, menuItems] = await Promise.all([
      prisma.receipts.findMany({ include: { receipt_items: true } }),
      prisma.users.findMany(),
      prisma.menu_items.findMany(),
    ]);
    const now = new Date();
    const daysAgo = (n: number) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - n);
    const weeksAgo = (n: number) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - n * 7);
    const monthsAgo = (n: number) => new Date(now.getFullYear(), now.getMonth() - n, 1);

    const totalReceipts = receipts.length;
    const totalCodesRedeemed = receipts.filter(r => r.user_id).length;
    const redemptionRate = totalReceipts === 0 ? 0 : Math.round((totalCodesRedeemed / totalReceipts) * 100);
    const totalPointsAwarded = receipts.reduce((sum, r) => sum + Number(r.points_earned), 0);
    const activeUsers = users.filter(u =>
      receipts.some(r => r.user_id === u.id && new Date(r.created_at) >= daysAgo(30))
    ).length;
    const newUsers = users.filter(u => new Date(u.created_at) >= daysAgo(30)).length;

    // 2. Daily Sales (last 30 days)
    const salesByDay: { date: string, count: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const day = daysAgo(i);
      const dateStr = day.toISOString().slice(0, 10);
      const count = receipts.filter(r => r.created_at.toISOString().slice(0, 10) === dateStr).length;
      salesByDay.push({ date: dateStr, count });
    }

    // 3. Top 10 and Least 10 Menu Items
    const itemSales: Record<string, number> = {};
    receipts.forEach(r => {
      r.receipt_items?.forEach(item => {
        if (item.menu_item_id) {
          itemSales[item.menu_item_id] = (itemSales[item.menu_item_id] || 0) + item.quantity;
        }
      });
    });
    const sortedItems = Object.entries(itemSales)
      .map(([id, count]) => ({
        id: Number(id),
        name: menuItems.find(m => m.id === Number(id))?.name || 'Unknown',
        count
      }))
      .sort((a, b) => b.count - a.count);
    const topItems = sortedItems.slice(0, 10);
    const leastItems = sortedItems.slice(-10).reverse();

    // 4. Category Breakdown Pie Chart
    const categorySales: Record<string, number> = {};
    receipts.forEach(r => {
      r.receipt_items?.forEach(item => {
        const menuItem = menuItems.find(m => m.id === item.menu_item_id);
        if (menuItem) {
          categorySales[menuItem.category] = (categorySales[menuItem.category] || 0) + item.quantity;
        }
      });
    });
    const categoryBreakdown = Object.entries(categorySales).map(([category, count]) => ({ category, count }));

    // 5. Issued vs Redeemed (last 12 weeks)
    const issuedVsRedeemed: { week: string, issued: number, redeemed: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const weekStart = weeksAgo(i);
      const weekEnd = weeksAgo(i - 1);
      const weekLabel = `${weekStart.toISOString().slice(0, 10)}`;
      const issued = receipts.filter(r => new Date(r.created_at) >= weekStart && new Date(r.created_at) < weekEnd).length;
      const redeemed = receipts.filter(r => r.user_id && new Date(r.created_at) >= weekStart && new Date(r.created_at) < weekEnd).length;
      issuedVsRedeemed.push({ week: weekLabel, issued, redeemed });
    }

    // 6. Monthly Engagement (last 6 months)
    const engagement: { month: string, users: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = monthsAgo(i);
      const monthEnd = monthsAgo(i - 1);
      const monthLabel = `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}`;
      const uniqueUsers = new Set(
        receipts
          .filter(r => r.user_id && new Date(r.created_at) >= monthStart && new Date(r.created_at) < monthEnd)
          .map(r => r.user_id)
      );
      engagement.push({ month: monthLabel, users: uniqueUsers.size });
    }

    // 7. Hourly Peak Times (09:00–19:00)
    const hourlyCounts: { hour: string, avg: number }[] = [];
    for (let h = 9; h <= 19; h++) {
      const hourStr = `${String(h).padStart(2, '0')}:00`;
      const receiptsAtHour = receipts.filter(r => new Date(r.created_at).getHours() === h);
      // Average per day
      const days = new Set(receiptsAtHour.map(r => r.created_at.toISOString().slice(0, 10))).size || 1;
      hourlyCounts.push({ hour: hourStr, avg: +(receiptsAtHour.length / days).toFixed(2) });
    }

    res.json({
      success: true,
      data: {
        kpis: {
          totalReceipts,
          totalCodesRedeemed,
          redemptionRate,
          activeUsers,
          newUsers,
          totalPointsAwarded
        },
        salesByDay,
        topItems,
        leastItems,
        categoryBreakdown,
        issuedVsRedeemed,
        engagement,
        hourlyCounts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch admin analytics' });
  }
});

export default router; 