export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'user' | 'admin';
  points: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface Receipt {
  id: string;
  userId: string;
  amount: number;
  points: number;
  status: 'pending' | 'approved' | 'rejected';
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  imageUrl: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Metrics {
  totalPoints: number;
  pendingReceipts: number;
  availableRewards: number;
  recentReceipts: Receipt[];
  recentRewards: Reward[];
  sustainabilityMetrics: {
    co2Saved: number;
    waterSaved: number;
    landSaved: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
} 