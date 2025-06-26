# The Leet Grind - LeetCode Progress Tracker

## Overview

The Leet Grind is a full-stack web application designed to help users track their LeetCode problem-solving progress. It allows users to organize problems into categories (To Do, Practice More, Completed), monitor their progress through statistics, and manage their coding practice efficiently.

The application is built with a modern React frontend and Express.js backend, designed to run on Replit with PostgreSQL database support.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **Forms**: React Hook Form with Zod validation for type-safe form handling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js 20 with TSX for development execution
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)
- **Validation**: Zod for runtime type validation and schema definitions
- **Database Provider**: Neon Database serverless for PostgreSQL hosting

## Key Components

### Database Schema
The application uses PostgreSQL with the following main tables:
- **users**: User authentication and profile data
- **problems**: LeetCode problem information including URL, difficulty, tags, and category

### Storage Strategy
Currently implements a dual storage approach:
- **Local Storage**: Client-side persistence for immediate use
- **Database Layer**: PostgreSQL backend ready for production with full CRUD operations

The storage interface (`IStorage`) provides abstraction between storage backends, allowing seamless switching between local and database storage.

### Problem Management System
- **URL Validation**: Strict validation for LeetCode problem URLs using regex patterns
- **Category System**: Three-tier categorization (To Do, Practice More, Completed)
- **Progress Tracking**: Real-time statistics calculation and progress visualization
- **Metadata Extraction**: Automatic extraction of problem details from URLs

### UI Components
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **Component Library**: Consistent UI using shadcn/ui components
- **Accessibility**: Built on Radix UI primitives for comprehensive screen reader support
- **Theme Support**: CSS variables configured for light/dark mode switching

## Data Flow

1. **Problem Addition**: User enters LeetCode URL → Frontend validates URL format → Extracts problem metadata → Stores in database via API
2. **Problem Management**: User updates problem category → Frontend sends PATCH request → Backend updates database → UI reflects changes
3. **Statistics**: Frontend calculates real-time statistics from problem data → Updates progress bars and counters
4. **Data Persistence**: All changes are persisted to PostgreSQL database with fallback to local storage

## External Dependencies

### Frontend Dependencies
- **UI Library**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS for utility-first styling
- **Forms**: React Hook Form + Hookform Resolvers for form management
- **Date Handling**: date-fns for date manipulation
- **Icons**: Lucide React for consistent iconography

### Backend Dependencies
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod for schema validation
- **Session Store**: connect-pg-simple for PostgreSQL session storage
- **Database Driver**: @neondatabase/serverless for serverless PostgreSQL connections

### Development Tools
- **Build**: Vite with React plugin and runtime error overlay
- **TypeScript**: Full TypeScript support across frontend and backend
- **Development**: TSX for TypeScript execution in development mode

## Deployment Strategy

### Replit Configuration
- **Platform**: Replit with autoscale deployment target
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Build Process**: `npm run build` compiles frontend and bundles backend
- **Runtime**: `npm run start` for production, `npm run dev` for development
- **Port Configuration**: Internal port 5000 mapped to external port 80

### Database Setup
- **Provider**: PostgreSQL 16 via Replit modules
- **ORM**: Drizzle with migrations in `./migrations` directory
- **Schema**: Centralized in `./shared/schema.ts` for type sharing
- **Connection**: Environment variable `DATABASE_URL` for database connection

### Build Process
1. **Frontend**: Vite builds React application to `dist/public`
2. **Backend**: esbuild bundles Express server to `dist/index.js`
3. **Assets**: Static files served from build output directory

## Changelog

Changelog:
- June 26, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.