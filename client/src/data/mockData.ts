// Mock Users
export const mockUsers = [
  {
    id: 'user_123',
    name: 'Jane Vegan',
    email: 'jane@vegan.com',
    password: 'vegan123', // In a real app, this would be hashed
    role: 'admin' as const,
    points: 500,
    createdAt: '2024-06-01T12:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    id: 'user_456',
    name: 'John Plant',
    email: 'john@plant.com',
    password: 'plant456', // In a real app, this would be hashed
    role: 'user' as const,
    points: 75,
    createdAt: '2024-05-15T10:00:00Z',
    updatedAt: '2024-06-02T15:00:00Z',
  },
  {
    id: 'user_789',
    name: 'Sarah Green',
    email: 'sarah@green.com',
    password: 'green789', // In a real app, this would be hashed
    role: 'user' as const,
    points: 200,
    createdAt: '2024-04-20T09:00:00Z',
    updatedAt: '2024-06-03T11:00:00Z',
  }
];

// Mock Receipts
export const mockReceipts = [
  {
    id: 'r1',
    userId: 'user_123',
    amount: 25.5,
    points: 30,
    status: 'approved' as const,
    imageUrl: 'https://example.com/receipt1.jpg',
    createdAt: '2024-06-01T12:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    id: 'r2',
    userId: 'user_123',
    amount: 18.0,
    points: 20,
    status: 'pending' as const,
    imageUrl: 'https://example.com/receipt2.jpg',
    createdAt: '2024-06-02T14:00:00Z',
    updatedAt: '2024-06-02T14:00:00Z',
  },
  {
    id: 'r3',
    userId: 'user_456',
    amount: 32.75,
    points: 35,
    status: 'approved' as const,
    imageUrl: 'https://example.com/receipt3.jpg',
    createdAt: '2024-06-01T15:00:00Z',
    updatedAt: '2024-06-01T15:00:00Z',
  },
  {
    id: 'r4',
    userId: 'user_789',
    amount: 45.0,
    points: 45,
    status: 'rejected' as const,
    imageUrl: 'https://example.com/receipt4.jpg',
    createdAt: '2024-06-03T10:00:00Z',
    updatedAt: '2024-06-03T10:00:00Z',
  }
];

// Mock Rewards
export const mockRewards = [
  {
    id: 'reward1',
    name: 'Free Vegan Dessert',
    description: 'Redeem for a free vegan dessert of your choice.',
    points: 50,
    imageUrl: 'https://example.com/dessert.jpg',
    available: true,
    createdAt: '2024-06-01T12:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    id: 'reward2',
    name: '10% Off Next Order',
    description: 'Get 10% off your next order of $30 or more.',
    points: 100,
    imageUrl: 'https://example.com/discount.jpg',
    available: false,
    createdAt: '2024-06-01T12:00:00Z',
    updatedAt: '2024-06-01T12:00:00Z',
  },
  {
    id: 'reward3',
    name: 'Free Smoothie',
    description: 'Enjoy a free vegan smoothie of your choice.',
    points: 75,
    imageUrl: 'https://example.com/smoothie.jpg',
    available: true,
    createdAt: '2024-06-02T09:00:00Z',
    updatedAt: '2024-06-02T09:00:00Z',
  },
  {
    id: 'reward4',
    name: '20% Off Entire Order',
    description: 'Get 20% off your entire order, no minimum purchase required.',
    points: 150,
    imageUrl: 'https://example.com/discount20.jpg',
    available: true,
    createdAt: '2024-06-03T11:00:00Z',
    updatedAt: '2024-06-03T11:00:00Z',
  }
];

// Mock Metrics
export const mockMetrics = {
  totalPoints: 395,
  pendingReceipts: 1,
  availableRewards: 3,
  recentReceipts: mockReceipts.slice(0, 3),
  recentRewards: mockRewards.slice(0, 3),
  sustainabilityMetrics: {
    co2Saved: 12.5, // kg
    waterSaved: 9000, // liters
    landSaved: 4.2, // m²
  },
};

// Mock Promo Codes
export const mockPromoCodes = [
  {
    code: 'FRIEND10',
    type: 'referral',
    value: 10, // points
    used: false,
    issuedTo: 'user_123',
    usedBy: null,
    expiresAt: '2024-07-01T00:00:00Z',
  },
  {
    code: 'SUMMER20',
    type: 'discount',
    value: 20, // percent off
    used: true,
    issuedTo: null,
    usedBy: 'user_456',
    expiresAt: '2024-08-01T00:00:00Z',
  },
  {
    code: 'WELCOME15',
    type: 'discount',
    value: 15, // percent off
    used: false,
    issuedTo: null,
    usedBy: null,
    expiresAt: '2024-09-01T00:00:00Z',
  },
  {
    code: 'REFER25',
    type: 'referral',
    value: 25, // points
    used: false,
    issuedTo: 'user_789',
    usedBy: null,
    expiresAt: '2024-07-15T00:00:00Z',
  }
];

// Export default user for initial state
export const mockUser = mockUsers[0]; 