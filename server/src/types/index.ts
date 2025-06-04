export interface User {
  id: string;
  name: string;
  points: number;
  status: 'active' | 'inactive';
}

export interface Reward {
  id: string;
  name: string;
  pointsCost: number;
  description: string;
}

export interface Receipt {
  id: string;
  userId: string;
  amount: number;
  date: string;
}

export interface Metrics {
  totalUsers: number;
  totalPoints: number;
  totalRewards: number;
}

export interface ApiError extends Error {
  statusCode: number;
  code: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
} 