import api from '../utils/api';
import { Metrics, ApiResponse, Receipt, Reward } from '../types';

export const metricsService = {
  async getMetrics(): Promise<ApiResponse<Metrics>> {
    const response = await api.get<ApiResponse<Metrics>>('/metrics');
    return response.data;
  },

  getUserMetrics: async (userId: string) => {
    const response = await fetch(`/api/metrics/user/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch metrics');
    return await response.json();
  },

  async getGlobalMetrics(): Promise<ApiResponse<Metrics>> {
    const response = await api.get<ApiResponse<Metrics>>('/metrics/global');
    return response.data;
  },

  getMockUserMetrics: async (userId: string): Promise<Metrics> => {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Mock receipts
    const recentReceipts: Receipt[] = [
      {
        id: '1',
        userId: user.id,
        amount: 1500,
        points: 15,
        status: 'approved',
        imageUrl: 'https://example.com/receipt1.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        userId: user.id,
        amount: 2000,
        points: 20,
        status: 'approved',
        imageUrl: 'https://example.com/receipt2.jpg',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    // Mock rewards
    const recentRewards: Reward[] = [
      {
        id: '1',
        name: 'Free Coffee',
        description: 'Get a free coffee at any participating store',
        points: 100,
        available: true,
        imageUrl: 'https://example.com/coffee.jpg',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return {
      totalPoints: user.points,
      pendingReceipts: 1,
      availableRewards: 3,
      recentReceipts,
      recentRewards,
      sustainabilityMetrics: {
        co2Saved: 150,
        waterSaved: 200,
        landSaved: 50,
      },
    };
  },
};
