# Wine List Manager

## Overview

A restaurant wine catalog management application that allows staff to organize, filter, and display wine collections. The app features:
- Automatic food pairing suggestions based on wine type and varietal
- Automatic price categorization ($, $$, $$$, $$$$)
- Complete food menu system with 37 Middle Eastern dishes across 4 categories
- Bidirectional wine/food pairing recommendations

Built as a full-stack TypeScript application with a React frontend and Express backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens defined in CSS variables
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (using tsx for development)
- **API Design**: RESTful endpoints under /api prefix
- **Data Validation**: Zod schemas shared between frontend and backend

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: shared/schema.ts (shared between client and server)
- **Migrations**: Drizzle Kit with migrations output to ./migrations
- **Current Storage**: In-memory storage implementation with interface for future database integration

### Business Logic
- **Wine Rules**: Automatic derivation of food pairings based on wine type and varietal
- **Price Categories**: Automatic categorization ($, $$, $$$, $$$$) based on price in cents
- **Computed Fields**: Applied server-side before storage using shared/wineRules.ts

### Build System
- **Development**: Vite dev server with HMR, proxied through Express
- **Production**: 
  - Client: Vite builds to dist/public
  - Server: esbuild bundles to dist/index.cjs with dependency bundling for faster cold starts
  - Selected dependencies are bundled to reduce syscalls

### Project Structure
```
client/           # React frontend
  src/
    components/ui/  # shadcn/ui components
    pages/          # Route components
    hooks/          # Custom React hooks
    lib/            # Utilities and query client
server/           # Express backend
  routes.ts       # API route definitions
  storage.ts      # Data storage interface and implementation
  vite.ts         # Vite integration for development
shared/           # Shared code between client and server
  schema.ts       # Wine schema and Zod validators
  foodSchema.ts   # Food schema with categories and filters
  wineRules.ts    # Business logic for wine categorization
  pairingRules.ts # Bidirectional wine/food pairing logic
```

### Routes
- `/` - Wine List with food pairings on cards
- `/food` - Food Menu with category filtering
- `/food/:id` - Food Detail with wine recommendations

### Data Files
- `attached_assets/wines.csv` - 66 wines loaded at startup
- `attached_assets/food_menu.csv` - 37 food items loaded at startup

## External Dependencies

### Database
- **PostgreSQL**: Configured via DATABASE_URL environment variable
- **Session Store**: connect-pg-simple for session persistence (available but not currently used)

### UI Framework
- **Radix UI**: Full suite of accessible primitives (dialog, select, popover, etc.)
- **Lucide React**: Icon library
- **Google Fonts**: Inter font family loaded via CDN

### Development Tools
- **Replit Plugins**: Runtime error overlay, cartographer, dev banner (Replit-specific)
- **TypeScript**: Strict mode with bundler module resolution