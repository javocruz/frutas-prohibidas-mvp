import api from '../utils/api';
import { Metrics, ApiResponse } from '../types';

export const metricsService = {
  async getMetrics(): Promise<ApiResponse<Metrics>> {
    const response = await api.get<ApiResponse<Metrics>>('/metrics');
    return response.data;
  },

  async getUserMetrics(userId: string): Promise<ApiResponse<Metrics>> {
    const response = await api.get<ApiResponse<Metrics>>(`/metrics/user/${userId}`);
    return response.data;
  },

  async getGlobalMetrics(): Promise<ApiResponse<Metrics>> {
    const response = await api.get<ApiResponse<Metrics>>('/metrics/global');
    return response.data;
  }
}; 