# Frutas Prohibidas MVP

A sustainability-focused loyalty system that rewards customers for making eco-friendly food choices. The system integrates with POS systems, generates sustainability receipts, and provides a comprehensive dashboard for tracking environmental impact.

## Project Overview

This MVP aims to:
- Integrate with POS systems (starting with Pikotea, scalable to Square, etc.)
- Generate sustainability receipts automatically
- Implement a point-based loyalty system based on environmental savings
- Enable rewards, discounts, and promotions
- Support referrals through promo codes
- Provide a dashboard for tracking CO₂, water, and land savings
- Use gamification for long-term engagement

## Quick Start

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd frutas-prohibidas-mvp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. Start the development server:
   ```bash
   npm run dev
   # Access at http://localhost:5173
   ```

## Project Structure
```
frutas-prohibidas-mvp/
├── client/              # Frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Library configurations
│   │   ├── pages/      # Page components
│   │   ├── providers/  # React context providers
│   │   ├── services/   # API services
│   │   ├── types/      # TypeScript types
│   │   └── utils/      # Utility functions
│   ├── public/         # Static assets
│   └── tests/          # Test files
├── server/             # Backend application
├── supabase/          # Supabase configuration
└── docs/              # Documentation
```

## Tech Stack
- **Frontend**:
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - Zustand (State Management)
  - React Router
  - Supabase (Backend as a Service)

## Data Types and Structures

### Domain Models

#### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  points: number;
  createdAt: string;
  updatedAt: string;
}
```

#### Receipt
```typescript
interface Receipt {
  id: string;
  userId: string;
  total_co2_saved: number;
  total_water_saved: number;
  total_land_saved: number;
  points_earned: number;
  status: 'pending' | 'approved' | 'rejected';
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Reward
```typescript
interface Reward {
  id: string;
  name: string;
  description: string;
  points_required: number;
  imageUrl: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### Metrics
```typescript
interface Metrics {
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
```

#### MenuItem
```typescript
interface MenuItem {
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
```

### Transport DTOs

#### API Response
```typescript
interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
```

#### Paginated Response
```typescript
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

#### API Error
```typescript
interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
```

### UI Components

#### Table Component
```typescript
interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  error?: string | null;
}
```

## Data Flow

1. **User Input/API Request**
   - User interacts with UI components
   - Form data is collected and validated
   - API requests are formatted using DTOs

2. **Data Transformation**
   - Input data is transformed to domain models
   - Business logic is applied
   - Data is prepared for storage

3. **Storage**
   - Domain models are mapped to database schema
   - Data is persisted in Supabase
   - Relationships are maintained

4. **Retrieval**
   - Data is fetched from database
   - Domain models are reconstructed
   - Data is prepared for UI

5. **Response/UI Update**
   - Data is transformed to view models
   - UI components are updated
   - User receives feedback

## Development Guidelines
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Follow the established project structure
- Use Tailwind CSS for styling
- Write tests for critical functionality
- Document API endpoints
- Follow Git commit conventions

## Next Steps

1. **Implement Supabase Integration**
   - Set up database schema
   - Create migration scripts
   - Implement data access layer

2. **Update Data Types**
   - Standardize type definitions
   - Remove duplicates
   - Add proper validation

3. **Refine Type Mappings**
   - Implement proper DTOs
   - Add transformation layers
   - Improve error handling

4. **Add Schema Validation**
   - Implement Zod schemas
   - Add runtime validation
   - Improve error messages

5. **Document API Endpoints**
   - Create OpenAPI specification
   - Document request/response types
   - Add usage examples

## Support
For any issues or questions, please contact the development team or create an issue in the repository.
