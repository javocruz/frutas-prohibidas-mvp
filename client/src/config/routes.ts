export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  RECEIPTS: '/receipts',
  REWARDS: '/rewards',
  ADMIN: '/admin',
  RECEIPTS_MAKER: '/receipts-maker',
} as const;

export type Route = (typeof ROUTES)[keyof typeof ROUTES];
