export interface MenuItem {
  id: number;
  category: string;
  name: string;
  sustainabilityMetrics: {
    co2Saved: number;  // in kg
    waterSaved: number; // in liters
    landSaved: number; // in m2
  };
  points: number;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
} 