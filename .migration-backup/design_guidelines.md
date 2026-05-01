# Wine List Management App - Design Guidelines

## Design Approach

**Selected System**: Material Design with data-focused modifications
**Rationale**: Restaurant management tool requiring efficient data entry, filtering, and display. Material's structured approach to forms, tables, and data visualization aligns perfectly with wine inventory management needs.

**Core Principles**:
- Clarity over decoration - staff need quick access to wine information
- Scannable data presentation with clear visual hierarchy
- Efficient workflows for data entry and filtering
- Professional aesthetic appropriate for restaurant operations

---

## Typography

**Primary Font**: Inter (via Google Fonts CDN)
**Usage**:
- Headings (H1): text-3xl font-bold (Dashboard title, main sections)
- Headings (H2): text-xl font-semibold (Section headers, modal titles)
- Body: text-base font-normal (Wine descriptions, form labels)
- Data/Numbers: text-sm font-medium tabular-nums (Prices, inventory counts)
- Badges/Tags: text-xs font-medium uppercase tracking-wide

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, and 8
- Component padding: p-4 to p-6
- Section spacing: space-y-6 or space-y-8
- Form fields: gap-4
- Card spacing: p-6

**Container Strategy**:
- Main dashboard: max-w-7xl mx-auto px-4
- Forms/Modals: max-w-2xl
- Data tables: Full-width within container

**Grid System**:
- Filter sidebar: Fixed 280px width on desktop, collapsible on mobile
- Main content area: Flexible grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for wine cards)
- Form layouts: Single column for inputs, multi-column only for compact field groups

---

## Component Library

### Navigation & Layout
**Top Bar**: 
- Fixed header with app title, upload button (primary action), user menu
- Height: h-16, shadow-sm for subtle elevation
- Sticky positioning for persistent access

**Filter Sidebar** (Desktop):
- Collapsible panel on left
- Search input at top
- Accordion-style filter groups (Food Pairing, Price Range, Wine Type)
- Clear filters button at bottom
- Mobile: Drawer overlay triggered by filter icon

### Data Display
**Wine Card**:
- Rounded corners (rounded-lg), subtle border
- Wine name as bold heading
- Wine type and varietal in smaller text
- Price displayed prominently (text-lg font-bold)
- Badge row for pairings and categories (see badges below)
- Edit/Delete action icons in top-right corner

**Wine Table View** (Alternative display):
- Sortable columns: Name, Type, Price, Pairings
- Row hover states for interactivity
- Compact spacing for scanning large lists
- Sticky header when scrolling

### Forms & Input
**Upload/Add Wine Form**:
- Modal overlay (backdrop blur)
- Single-column layout with clear field labels
- Input fields: Full-width text inputs with focus rings
- Dropdowns for Type selection (Searchable if many options)
- Price input: Number field with currency prefix
- Multi-select for food pairings (Checkbox group or tag input)
- Action buttons: Primary "Add Wine" + Secondary "Cancel"

**Search Bar**:
- Prominent placement at top of filter sidebar
- Icon prefix (magnifying glass from Heroicons)
- Placeholder: "Search wines..."
- Clear button appears when typing

### Badges & Tags
**Implementation**:
- Pill-shaped (rounded-full), inline-flex items-center
- Padding: px-3 py-1
- Size: text-xs font-medium
- Types:
  - Wine Type badges (Red, White, Rosé, Sparkling)
  - Price Range badges ($, $$, $$$, $$$$)
  - Food Pairing tags (Beef, Seafood, Pasta, Cheese, etc.)
- Multiple badges per wine, wrapped in flex container with gap-2

### Buttons
**Primary Actions** (Add Wine, Apply Filters):
- Rounded (rounded-md), medium padding (px-6 py-2.5)
- Font: text-sm font-semibold
- Shadow for depth

**Secondary/Ghost** (Cancel, Clear Filters):
- Minimal border, transparent background
- Same sizing as primary for consistency

**Icon Buttons** (Edit, Delete, Filter toggle):
- Square aspect ratio, p-2
- Icons from Heroicons CDN

### Empty States
**No Wines Found**:
- Centered container with icon (wine glass from Heroicons)
- Helpful message: "No wines match your filters" or "Add your first wine to get started"
- Primary CTA button if appropriate context

---

## Interaction Patterns

**Filtering**:
- Instant filter application (no "Apply" button needed)
- Active filter count badge on mobile filter trigger
- Visual feedback showing which filters are active

**Sorting**:
- Table column headers clickable with sort indicators
- Default sort: Alphabetical by name

**Modal Workflows**:
- Add Wine: Modal with form
- Edit Wine: Pre-populated modal with same form
- Delete: Confirmation dialog (smaller modal)

**Loading States**:
- Skeleton loaders for wine cards during data fetch
- Spinner for form submissions

---

## Responsive Behavior

**Desktop (lg:+)**:
- Sidebar visible, wine cards in 3-column grid
- Table view option available

**Tablet (md:)**:
- Sidebar collapses to drawer, 2-column wine grid
- Filter button in top bar

**Mobile (base)**:
- Full-width single column
- Bottom action button for "Add Wine" (floating)
- Simplified card view only

---

## Images

**No hero image** - This is a functional dashboard application.

**Wine Bottle Placeholders**:
- Small thumbnail images in wine cards (optional but recommended)
- Size: 60x60px, rounded corners
- Positioned left of wine name
- Use placeholder images if no wine photo available

---

## Accessibility

- All form inputs with associated labels
- Keyboard navigation for filters and table sorting
- Focus indicators on all interactive elements
- Semantic HTML (table for data table, proper heading hierarchy)
- ARIA labels for icon-only buttons