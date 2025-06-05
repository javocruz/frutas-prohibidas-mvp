import { MenuItem } from '../types/menu';

// Raw CSV data parsed into menu items
export const menuItems: MenuItem[] = [
  {
    id: 1,
    category: "AWEVOS Benedict",
    name: "Benedict del Génesis",
    sustainabilityMetrics: {
      co2Saved: 1.04,
      waterSaved: 835,
      landSaved: 0.68
    },
    points: 25 // Calculated based on metrics
  },
  {
    id: 2,
    category: "AWEVOS Benedict",
    name: "Benedict de la Tierra Prometida",
    sustainabilityMetrics: {
      co2Saved: 1.24,
      waterSaved: 822,
      landSaved: 0.625
    },
    points: 28
  },
  {
    id: 3,
    category: "AWEVOS Benedict",
    name: "Benedict del Infierno",
    sustainabilityMetrics: {
      co2Saved: 1.72,
      waterSaved: 1205,
      landSaved: 1.775
    },
    points: 42
  },
  {
    id: 4,
    category: "SANDOS",
    name: "Sando \"Baconator\"",
    sustainabilityMetrics: {
      co2Saved: 1.08,
      waterSaved: 875,
      landSaved: 0.8
    },
    points: 26
  },
  {
    id: 5,
    category: "SANDOS",
    name: "Sando del Fuego Eterno",
    sustainabilityMetrics: {
      co2Saved: 1.37,
      waterSaved: 941,
      landSaved: 0.83
    },
    points: 31
  },
  {
    id: 6,
    category: "SANDOS",
    name: "Sando del Paraíso",
    sustainabilityMetrics: {
      co2Saved: 0.83,
      waterSaved: 570,
      landSaved: 0.205
    },
    points: 19
  },
  {
    id: 7,
    category: "SANDOS",
    name: "Sando con Alas",
    sustainabilityMetrics: {
      co2Saved: 1.24,
      waterSaved: 1405,
      landSaved: 0.18
    },
    points: 30
  },
  {
    id: 8,
    category: "PANCAKES",
    name: "Pancakes Torre de babel con Açaí",
    sustainabilityMetrics: {
      co2Saved: 0.5,
      waterSaved: 300,
      landSaved: 0.1
    },
    points: 12
  },
  {
    id: 9,
    category: "PANCAKES",
    name: "Pancakes de Alicia",
    sustainabilityMetrics: {
      co2Saved: 0.75,
      waterSaved: 420,
      landSaved: 0.15
    },
    points: 17
  },
  {
    id: 10,
    category: "TORRIJA",
    name: "La Torrija Pecadora de Rose",
    sustainabilityMetrics: {
      co2Saved: 0.445,
      waterSaved: 265,
      landSaved: 0.295
    },
    points: 11
  }
  // ... Add more items as needed
];

// Helper function to get items by category
export const getItemsByCategory = (category: string): MenuItem[] => {
  return menuItems.filter(item => item.category === category);
};

// Helper function to get all categories
export const getCategories = (): string[] => {
  return [...new Set(menuItems.map(item => item.category))];
};

// Helper function to calculate points based on sustainability metrics
export const calculatePoints = (metrics: MenuItem['sustainabilityMetrics']): number => {
  const co2Points = metrics.co2Saved * 10; // 1kg CO2 = 10 points
  const waterPoints = metrics.waterSaved * 0.01; // 100L water = 1 point
  const landPoints = metrics.landSaved * 5; // 1m2 land = 5 points
  
  return Math.round(co2Points + waterPoints + landPoints);
}; 