# Wine Pairing Wizard

## Overview

An AI-enhanced wine and food pairing recommendation application. The app features:
- Two pairing modes: "I have a dish" (finds wines) and "I have a wine" (finds foods)
- Deterministic pairing rules engine based on protein, flavor, cooking method
- Web search evidence integration via Serper API for expert sommelier sources
- Admin panel for managing source domains, evidence cache, and viewing pairing logs
- 66 wines and 37 Middle Eastern dishes loaded from CSV files

Built as a full-stack TypeScript application with Next.js App Router.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **UI Components**: Custom components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens (wine-themed rose/purple colors)
- **Icons**: Lucide React

### Backend Architecture
- **Runtime**: Node.js with Next.js API routes
- **Language**: TypeScript
- **API Design**: RESTful endpoints under /api prefix
- **Rate Limiting**: 20 requests per minute per IP

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: lib/schema.ts
- **Database**: PostgreSQL (Replit-managed)

### Business Logic
- **Pairing Rules**: lib/pairingRules.ts - protein/flavor/cooking method matching
- **Evidence Engine**: lib/evidenceEngine.ts - Serper API integration with tier-based source weighting
- **Confidence Scoring**: Rule score (50-100) + evidence boost (up to 30) = final confidence

### Project Structure
```
app/                    # Next.js App Router pages
  page.tsx              # Home page with mode selection
  wizard/dish/page.tsx  # 3-step dish wizard
  wizard/wine/page.tsx  # 2-step wine wizard
  results/page.tsx      # Pairing results display
  admin/page.tsx        # Admin panel
  api/                  # API routes
    wines/route.ts      # GET wines list
    foods/route.ts      # GET foods list
    pair/route.ts       # POST pairing request
    results/[id]/route.ts # GET pairing results
    admin/              # Admin API routes
components/ui/          # UI components (Button, Card, Input, etc.)
lib/
  db.ts                 # Drizzle database connection
  schema.ts             # Database schema definitions
  pairingRules.ts       # Wine/food pairing logic
  evidenceEngine.ts     # Web search integration
  utils.ts              # Utility functions
delbarcsv/              # Source CSV data files
  wine_list.csv         # 66 wines
  food_menu.csv         # 37 dishes
script/
  seed.ts               # Database seeding script
```

### Routes
- `/` - Home page with "I have a dish" / "I have a wine" mode selection
- `/wizard/dish` - 3-step wizard: Basic Info → Flavors → Preferences
- `/wizard/wine` - 2-step wizard: Wine Selection → Characteristics
- `/results?requestId=xxx&mode=xxx` - Pairing results with confidence scores
- `/admin` - Admin panel (login: admin@winewizard.com / admin123)

### API Endpoints
- `GET /api/wines` - All wines ordered by name
- `GET /api/foods` - All foods ordered by name
- `POST /api/pair` - Generate pairings (mode: "dish" or "wine")
- `GET /api/results/[id]` - Fetch pairing result by request ID
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/domains` - Source domain configuration
- `PATCH /api/admin/domains/[id]` - Toggle domain enabled status
- `GET /api/admin/cache` - Evidence cache entries
- `DELETE /api/admin/cache` - Clear evidence cache
- `GET /api/admin/requests` - Recent pairing request logs

### Data Files
- `delbarcsv/wine_list.csv` - 66 wines with name, grape, category, origin, price, notes
- `delbarcsv/food_menu.csv` - 37 dishes with name, category, price

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection string (auto-configured by Replit)

### Optional
- `SERPER_API_KEY` - Serper.dev API key for web search evidence (pairings work without it)
- `ADMIN_EMAIL` - Admin login email (default: admin@winewizard.com)
- `ADMIN_PASSWORD` - Admin login password (default: admin123)

## Pairing Algorithm

1. **Rule-based scoring** (50-100 points):
   - Protein matching: +20 points for compatible wine/protein pairs
   - Flavor matching: +10 points per matching flavor note
   - Cooking method: +10 points for compatible preparation
   - Wine color preference: +15/-10 points
   - Heat/spice level: Boosts off-dry wines like Riesling

2. **Evidence boost** (up to 30 points):
   - Web search for expert sommelier sources
   - Tier A sources (Guild Somm, Jancis Robinson): +5 points each
   - Tier B sources: +3 points each
   - Tier C sources: +1 point each

3. **Final confidence**: min(100, rule_score + evidence_boost)

## Source Domain Tiers

- **Tier A** (weight 1.0): guildsomm.com, jancisrobinson.com, winespectator.com, decanter.com
- **Tier B** (weight 0.8): wineenthusiast.com, thewinesociety.com, masterclass.com
- **Tier C** (weight 0.6-0.4): winefolly.com, vivino.com
