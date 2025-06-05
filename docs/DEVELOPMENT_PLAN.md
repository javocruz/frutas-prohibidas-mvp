# Frutas Prohibidas MVP Development Plan

## SMART Goal

Develop and launch by June 30 a functional multi-platform system that:
- Integrates with any POS system (starting with Pikotea, scalable to Square, etc.).
- Automatically generates a sustainability receipt per order.
- Visually enhances the receipt for customer clarity.
- Implements a point-based loyalty system based on environmental savings.
- Enables rewards, discounts, and promotions.
- Supports referrals through promo codes.
- Offers a dashboard for customers to track CO₂, water, and land savings.
- Uses gamification principles for long-term engagement.

## Specific Objectives

1. Build an automated sustainability receipt system integrated with POS.
2. Redesign the visual layout of the receipt.
3. Implement a point system tied to environmental savings.
4. Integrate referral and discount promo codes.
5. Create a personal dashboard to display cumulative impact.
6. Ensure multi-platform scalability and compatibility.
7. Deliver a functional and user-tested product.

## Project Overview
A sustainability dashboard that rewards users for making eco-friendly food choices. Users can scan receipts, earn points based on their sustainable choices, and redeem rewards.

## Core Features

### 1. User Authentication & Profile
- [ ] User registration and login
- [ ] Profile management
- [ ] Points history and statistics
- [ ] Role-based access (user/admin)

### 2. Receipt Management
- [ ] Receipt scanning interface
- [ ] OCR integration for receipt processing
- [ ] Manual receipt entry option
- [ ] Receipt validation and approval system
- [ ] Receipt history and status tracking

### 3. Points System
- [ ] Points calculation based on sustainability metrics
- [ ] Points history and transactions
- [ ] Points balance display
- [ ] Points expiration system (if applicable)

### 4. Rewards System
- [ ] Rewards catalog
- [ ] Points redemption process
- [ ] Reward status tracking
- [ ] Reward history

### 5. Sustainability Dashboard
- [ ] User's sustainability impact visualization
- [ ] CO2 savings tracking
- [ ] Water savings tracking
- [ ] Land usage savings tracking
- [ ] Progress charts and statistics

### 6. Admin Panel
- [ ] User management
- [ ] Receipt approval system
- [ ] Rewards management
- [ ] Analytics and reporting
- [ ] System configuration

## Technical Implementation

### Frontend (React + TypeScript)
- [ ] Component architecture
- [ ] State management
- [ ] API integration
- [ ] Form handling
- [ ] Data visualization
- [ ] Responsive design
- [ ] Accessibility implementation

### Backend (Node.js + Express)
- [ ] API endpoints
- [ ] Authentication middleware
- [ ] Database integration
- [ ] File handling
- [ ] Security measures
- [ ] Error handling

### Database Schema
- [ ] Users
- [ ] Receipts
- [ ] Rewards
- [ ] Points transactions
- [ ] Sustainability metrics

### Testing Strategy
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance testing
- [ ] Security testing

## Development Phases

### Phase 1: Foundation
1. Project setup and configuration
2. Basic authentication
3. Core data models
4. Basic UI components

### Phase 2: Core Features
1. Receipt scanning
2. Points calculation
3. Basic rewards system
4. User dashboard

### Phase 3: Advanced Features
1. Sustainability metrics
2. Advanced analytics
3. Admin panel
4. Reward management

### Phase 4: Polish
1. UI/UX improvements
2. Performance optimization
3. Testing and bug fixes
4. Documentation

## Technical Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Query
- React Hook Form
- Chart.js/D3.js

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma
- JWT Authentication

### Development Tools
- Git
- ESLint
- Prettier
- Husky
- Jest/Vitest
- Docker

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

### Users
- GET /api/users
- GET /api/users/:id
- PUT /api/users/:id
- GET /api/users/:id/points
- GET /api/users/:id/receipts

### Receipts
- POST /api/receipts
- GET /api/receipts
- GET /api/receipts/:id
- PUT /api/receipts/:id/status
- GET /api/receipts/stats

### Rewards
- GET /api/rewards
- POST /api/rewards
- GET /api/rewards/:id
- POST /api/rewards/:id/redeem
- GET /api/rewards/redeemed

### Points
- GET /api/points/balance
- GET /api/points/history
- POST /api/points/calculate
- GET /api/points/stats

## Database Schema

### Users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Receipts
```sql
CREATE TABLE receipts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  points INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  image_url VARCHAR(255),
  items JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Rewards
```sql
CREATE TABLE rewards (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Points Transactions
```sql
CREATE TABLE points_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  amount INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL,
  reference_id INTEGER,
  reference_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Considerations
- JWT token authentication
- Password hashing
- Input validation
- CORS configuration
- Rate limiting
- Data encryption
- XSS protection
- CSRF protection

## Performance Optimization
- Database indexing
- Query optimization
- Caching strategy
- Image optimization
- Code splitting
- Lazy loading
- API response compression

## Monitoring and Logging
- Error tracking
- Performance monitoring
- User activity logging
- System health checks
- Audit logging

## Deployment Strategy
- Docker containerization
- CI/CD pipeline
- Environment configuration
- Backup strategy
- Scaling plan

## Future Enhancements
- Mobile app development
- Social features
- Gamification elements
- Advanced analytics
- Machine learning integration
- API documentation
- Third-party integrations 