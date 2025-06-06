import api from '../utils/api';
import { Receipt, ApiResponse, PaginatedResponse } from '../types';

export const receiptService = {
  async getReceipts(page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<Receipt>>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Receipt>>>(`/receipts?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getReceipt(id: string): Promise<ApiResponse<Receipt>> {
    const response = await api.get<ApiResponse<Receipt>>(`/receipts/${id}`);
    return response.data;
  },

  async createReceipt(data: FormData): Promise<ApiResponse<Receipt>> {
    const response = await api.post<ApiResponse<Receipt>>('/receipts', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  async updateReceipt(id: string, data: Partial<Receipt>): Promise<ApiResponse<Receipt>> {
    const response = await api.put<ApiResponse<Receipt>>(`/receipts/${id}`, data);
    return response.data;
  },

  async deleteReceipt(id: string): Promise<void> {
    await api.delete(`/receipts/${id}`);
  },

  async approveReceipt(id: string): Promise<ApiResponse<Receipt>> {
    const response = await api.post<ApiResponse<Receipt>>(`/receipts/${id}/approve`);
    return response.data;
  },

  async rejectReceipt(id: string): Promise<ApiResponse<Receipt>> {
    const response = await api.post<ApiResponse<Receipt>>(`/receipts/${id}/reject`);
    return response.data;
  }
}; 