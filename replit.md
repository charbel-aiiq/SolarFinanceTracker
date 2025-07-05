# Solar Finance Pro - Replit Project Guide

## Overview

Solar Finance Pro is a comprehensive financial management system designed for tracking and analyzing solar energy projects. The application provides tools for managing project portfolios, tracking client and supplier payments, calculating financial metrics like IRR (Internal Rate of Return), and generating detailed financial reports.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with custom Tailwind CSS styling
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful endpoints with proper HTTP status codes
- **Validation**: Zod schemas for request/response validation
- **Development**: Hot module replacement via Vite middleware

### Project Structure
```
├── client/          # React frontend application
├── server/          # Express backend API
├── shared/          # Shared types and schemas
├── migrations/      # Database migration files
└── dist/           # Production build output
```

## Key Components

### Database Schema
- **Projects**: Core project information including system size, investment amount, client details, and IRR calculations
- **Payments**: Track both client payments (income) and supplier payments (expenses) with recurring payment support
- **Cash Flow Projections**: Monthly cash flow forecasting with projected vs actual tracking
- **Suppliers**: Vendor/supplier management with contact information, payment terms, and credit ratings
- **Cost Components**: Reusable cost components (solar panels, inverters, labor, etc.) with categories and base pricing
- **Supplier Components**: Many-to-many relationship linking suppliers to components with specific pricing and terms
- **Project Components**: Actual components used in specific projects with quantities, costs, and delivery tracking

### API Endpoints
- **Projects**: CRUD operations for solar projects
- **Payments**: Payment management with project association
- **Financial Calculations**: IRR and P&L calculation endpoints
- **Dashboard**: Aggregated statistics and metrics
- **Suppliers**: CRUD operations for supplier management
- **Cost Components**: Manage reusable cost components and categories
- **Supplier Components**: Link suppliers to components with specific pricing
- **Project Components**: Track actual components used in projects with delivery status

### UI Components
- **Layout**: Responsive sidebar navigation with mobile support
- **Forms**: Validation-enabled forms for project, payment, supplier, and component creation
- **Data Display**: Cards, tables, and charts for financial data visualization
- **Modals**: Dialog-based forms for data entry
- **Component Management**: Interfaces for managing suppliers, cost components, and project components

## Data Flow

1. **Supplier & Component Setup**: Users create suppliers with payment terms and cost components with base pricing
2. **Project Creation**: Users create solar projects with basic information (name, location, system size, investment amount)
3. **Component Selection**: Users add components to projects from the component library, selecting specific suppliers and quantities
4. **Payment Tracking**: Users record client payments (income) and supplier payments (expenses) associated with projects
5. **Component Delivery**: Track component delivery status and actual costs vs. estimates
6. **Financial Calculations**: System automatically calculates IRR, P&L, and other financial metrics including component costs
7. **Cash Flow Management**: Leverage supplier payment terms for better cash flow management and projections
8. **Reporting**: Dashboard provides aggregated views and export capabilities

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Router (Wouter)
- **UI Libraries**: Radix UI components, Lucide React icons
- **State Management**: TanStack Query for API state
- **Forms**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS, Class Variance Authority
- **Date Handling**: date-fns for date manipulation

### Backend Dependencies
- **Server Framework**: Express.js with TypeScript support
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod for schema validation
- **Development**: TSX for TypeScript execution, Vite for development server

### Database
- **Provider**: Neon Database (serverless PostgreSQL)
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for database schema management

## Deployment Strategy

### Development
- **Client**: Vite dev server with HMR
- **Server**: Express server with Vite middleware integration
- **Database**: Neon Database connection via environment variables

### Production
- **Build Process**: Vite builds client, ESBuild bundles server
- **Client**: Static files served by Express
- **Server**: Single Node.js process serving both API and static files
- **Database**: Production Neon Database instance

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string for Neon Database
- `NODE_ENV`: Environment mode (development/production)

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 05, 2025. Initial setup