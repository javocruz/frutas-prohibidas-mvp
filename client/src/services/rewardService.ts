import api from '../utils/api';
import { Reward, ApiResponse, PaginatedResponse } from '../types';

export const rewardService = {
  async getRewards(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Reward>>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Reward>>>(`/rewards?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getReward(id: string): Promise<ApiResponse<Reward>> {
    const response = await api.get<ApiResponse<Reward>>(`/rewards/${id}`);
    return response.data;
  },

  async createReward(data: Omit<Reward, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Reward>> {
    const response = await api.post<ApiResponse<Reward>>('/rewards', data);
    return response.data;
  },

  async updateReward(id: string, data: Partial<Reward>): Promise<ApiResponse<Reward>> {
    const response = await api.put<ApiResponse<Reward>>(`/rewards/${id}`, data);
    return response.data;
  },

  async deleteReward(id: string): Promise<void> {
    await api.delete(`/rewards/${id}`);
  },

  async redeemReward(userId: string, rewardId: string): Promise<ApiResponse<{ points: number }>> {
    const response = await api.post<ApiResponse<{ points: number }>>(`/rewards/${rewardId}/redeem`, { userId });
    return response.data;
  }
}; 