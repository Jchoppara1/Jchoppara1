# Wine List Manager

## Overview

A restaurant wine catalog management application that allows staff to organize, filter, and display wine collections. The app features:
- Automatic food pairing suggestions based on wine type and varietal
- Automatic price categorization ($, $$, $$$, $$$$)
- Complete food menu system with 37 Middle Eastern dishes across 4 categories
- Bidirectional wine/food pairing recommendations
- Admin inventory management system with secure login, stock control, and label management

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
- **Wine Type Classification**: 8-category system (red, white, rose, sparkling, orange, fortified, dessert, nonAlcoholic) with keyword-precedence classifier in shared/wineTypes.ts
- **Wine Type UI**: Centralized color map and label helper in client/src/lib/wineTypeColors.ts; all display uses wineTypeLabel() for human-readable names
- **Wine Profile Inference**: Grape variety database drives body/acidity/tannin/sweetness/oak profiling (shared/wineProfile.ts)
- **Structured Descriptions**: Auto-generated headline, aromas, palate notes, serving suggestions per wine
- **Scoring-Based Pairings**: 6-dimension weighted algorithm (intensity 0.25, acid-fat 0.2, tannin-protein 0.2, spice 0.15, sauce 0.1, regional 0.1) in shared/pairingEngine.ts
- **Classic vs Adventurous Modes**: Stricter thresholds vs wider matching with novelty bonus
- **Price Categories**: Percentile-based normalization ($, $$, $$$, $$$$) from actual data distribution
- **"Why it Works" Explanations**: Each pairing includes scoring breakdown and natural language reasons
- **Wine Rules**: Legacy food pairing derivation based on wine type and varietal (shared/wineRules.ts)
- **Computed Fields**: Applied server-side before storage

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
  wineRules.ts    # Legacy business logic for wine categorization
  wineProfile.ts  # Wine profile inference engine and description generator
  pairingEngine.ts # Scoring-based pairing algorithm with explanations
  pairingRules.ts # Legacy bidirectional wine/food pairing logic
```

### Filter UX Pattern
- **Deferred Apply**: All filter UIs use a draft/applied two-state pattern
- Filter inputs update `draftFilters` only; results update only when "Apply Filters" is clicked
- "Unsaved changes" indicator appears when draft differs from applied
- "Apply Filters" button disabled when no changes; "Reset" clears both states
- Implemented on: Wine List (home.tsx), Food Menu dish filters & wine pairing filters (food-menu.tsx)

### Routes
- `/` - Wine List with food pairings on cards
- `/food` - Food Menu with category filtering
- `/food/:id` - Food Detail with wine recommendations
- `/admin` - Admin inventory management (login required)
- `/deck` - Investor screenshot deck (standalone presentation, no navbar)

### Admin System
- **Auth**: Session-based with bcrypt password hashing, rate limiting (5 attempts / 15min lockout)
- **Credentials**: ADMIN_EMAIL and ADMIN_PASSWORD environment secrets
- **Session**: express-session with SESSION_SECRET, httpOnly cookies
- **Features**: Stock toggle (out-of-stock items hidden from public), label management, CRUD for wines and food items
- **Wine Labels**: Featured, New, ByTheGlass, Reserve
- **Food Labels**: Seasonal, New, ChefSpecial
- **Admin Routes**: /api/admin/login, /api/admin/logout, /api/admin/me, /api/admin/wines, /api/admin/menu
- **Files**: server/adminRoutes.ts (auth + routes), client/src/pages/admin.tsx (UI)

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