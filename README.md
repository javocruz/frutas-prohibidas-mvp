# Frutas Prohibidas Sustainability Dashboard

A modern web application for monitoring and analyzing sustainability metrics in the agricultural sector. Built with React, TypeScript, and Node.js.

## Project Structure
```
frutas-prohibidas-mvp/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── api/          # API integration
│   │   ├── utils/        # Utility functions
│   │   ├── context/      # React context providers
│   │   └── config/       # Configuration files
│   └── public/           # Static assets
└── server/               # Backend Node.js server
```

## Tech Stack
- **Frontend**:
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - React Router
  - Recharts (for data visualization)
- **Backend**:
  - Node.js
  - Express
  - TypeScript

## Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

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

3. Start the development servers:

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
- Real-time sustainability metrics visualization
- Interactive data dashboards
- Agricultural impact analysis
- Environmental monitoring
- Responsive design for all devices
- Type-safe development with TypeScript

## Code Organization
- **Components**: Reusable UI elements following React best practices
- **Pages**: Main application views and routing
- **API**: Backend communication and data fetching
- **Utils**: Helper functions and utilities
- **Context**: Global state management
- **Config**: Environment and application configuration

## Development Guidelines
- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error handling
- Follow the established project structure
- Use Tailwind CSS for styling

## Support
For any issues or questions, please contact the development team or create an issue in the repository.
