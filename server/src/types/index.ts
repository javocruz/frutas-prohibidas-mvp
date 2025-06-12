export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  points_required: number;
  image_url: string;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Receipt {
  id: string;
  user_id: string;
  total_co2_saved: number;
  total_water_saved: number;
  total_land_saved: number;
  points_earned: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface ReceiptItem {
  id: string;
  receipt_id: string;
  menu_item_id: string;
  quantity: number;
  created_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  co2_saved: number;
  water_saved: number;
  land_saved: number;
  created_at: string;
  updated_at: string;
  category: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface UserReward {
  id: string;
  user_id: string;
  reward_id: string;
  redeemed_at: string;
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