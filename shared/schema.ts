import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const wineTypes = ["Red", "White", "Rosé", "Sparkling"] as const;
export type WineType = typeof wineTypes[number];

export const priceCategories = ["$", "$$", "$$$", "$$$$"] as const;
export type PriceCategory = typeof priceCategories[number];

export const foodPairingOptions = [
  "Beef",
  "Lamb",
  "Poultry",
  "Pork",
  "Seafood",
  "Fish",
  "Pasta",
  "Cheese",
  "Salads",
  "Desserts",
  "Spicy Food",
  "Appetizers",
] as const;
export type FoodPairing = typeof foodPairingOptions[number];

export const wines = pgTable("wines", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  wineType: varchar("wine_type", { length: 20 }).notNull(),
  varietal: text("varietal").notNull(),
  priceCents: integer("price_cents").notNull(),
  description: text("description"),
  priceCategory: varchar("price_category", { length: 10 }).notNull(),
  foodPairings: text("food_pairings").array().notNull(),
});

export const insertWineSchema = createInsertSchema(wines)
  .omit({ id: true, priceCategory: true, foodPairings: true })
  .extend({
    name: z.string().min(1, "Name is required").max(200),
    wineType: z.enum(wineTypes),
    varietal: z.string().min(1, "Varietal is required").max(100),
    priceCents: z.number().int().min(0, "Price must be positive"),
    description: z.string().max(1000).optional(),
  });

export type InsertWine = z.infer<typeof insertWineSchema>;
export type Wine = typeof wines.$inferSelect;

export const wineFiltersSchema = z.object({
  search: z.string().optional(),
  wineType: z.enum(wineTypes).optional(),
  priceCategory: z.enum(priceCategories).optional(),
  foodPairing: z.enum(foodPairingOptions).optional(),
});

export type WineFilters = z.infer<typeof wineFiltersSchema>;

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
