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

export interface MenuItem {
  id: number;
  category: string;
  name: string;
  co2_saved: number;
  water_saved: number;
  land_saved: number;
  created_at: string;
  updated_at: string;
}

export interface ReceiptItem {
  id: string;
  receipt_id: string;
  menu_item_id: number;
  quantity: number;
  created_at: string;
  menu_items?: MenuItem;
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
  receipt_items: ReceiptItem[];
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  points_required: number;
  image_url?: string;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserReward {
  id: string;
  user_id: string;
  reward_id: string;
  redeemed_at: string;
  rewards: Reward;
}

export interface Metrics {
  totalPoints: number;
  sustainabilityMetrics: {
    co2Saved: number;
    waterSaved: number;
    landSaved: number;
  };
  recentReceipts: {
    id: string;
    createdAt: string;
    pointsEarned: number;
    items: {
      name: string;
      quantity: number;
    }[];
  }[];
  recentRewards: {
    id: string;
    name: string;
    description: string;
    redeemedAt: string;
  }[];
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
