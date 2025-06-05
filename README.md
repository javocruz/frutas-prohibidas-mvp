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

## Project Structure
```
frutas-prohibidas-mvp/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── utils/        # Utility functions
│   │   ├── context/      # React context providers
│   │   ├── types/        # TypeScript type definitions
│   │   └── config/       # Configuration files
│   └── public/           # Static assets
└── server/               # Backend Node.js server
    ├── src/
    │   ├── controllers/  # Route controllers
    │   ├── models/       # Database models
    │   ├── routes/       # API routes
    │   ├── services/     # Business logic
    │   ├── utils/        # Utility functions
    │   └── config/       # Configuration files
    └── prisma/          # Database schema and migrations
```

## Tech Stack
- **Frontend**:
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - React Query
  - React Router
  - Chart.js (for data visualization)
- **Backend**:
  - Node.js
  - Express
  - TypeScript
  - PostgreSQL
  - Prisma ORM
  - JWT Authentication

## Prerequisites
- Node.js (v18 or higher)
- npm (v8 or higher)
- PostgreSQL (v14 or higher)

## Development Setup

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd frutas-prohibidas-mvp
   ```

2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server && npm install
   
   # Install client dependencies
   cd ../client && npm install
   ```

3. Set up the database:
   ```bash
   cd server
   npx prisma migrate dev
   ```

4. Start the development servers:

   For the frontend:
   ```bash
   cd client
   npm run dev
   # Access at http://localhost:5173
   ```

   For the backend:
   ```bash
   cd server
   npm run dev
   # Server runs on http://localhost:3000
   ```

## Key Features
- POS System Integration
- Sustainability Receipt Generation
- Points-based Loyalty System
- Environmental Impact Tracking
- Rewards and Promotions
- Referral System
- Customer Dashboard
- Admin Panel

## Development Guidelines
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Follow the established project structure
- Use Tailwind CSS for styling
- Write tests for critical functionality
- Document API endpoints
- Follow Git commit conventions

## Project Documentation
- [Development Plan](./DEVELOPMENT_PLAN.md)
- [Task List](./TASKS.md)
- [API Documentation](./docs/API.md)

## Support
For any issues or questions, please contact the development team or create an issue in the repository.

## Branch Protection Rules

This project uses GitHub's branch protection rules to maintain code quality and security:

- All changes to the main branch must go through pull requests
- At least one approval is required before merging
- Branches must be up to date before merging
- Status checks must pass before merging
- Code review is required for all changes
