export interface User {
  id: string;
  email: string;
  name: string;
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
  user_id: string;
  total_co2_saved: number;
  total_water_saved: number;
  total_land_saved: number;
  points_earned: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
  // Legacy/compat fields
  userId?: string;
  amount?: number;
  points?: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
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

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<User>;
  checkAuth: () => Promise<User | null>;
} 