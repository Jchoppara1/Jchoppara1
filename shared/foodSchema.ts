import { z } from "zod";

export const foodCategories = ["Mazzes", "Spreads", "Greens & Grains", "Meats & Seafood"] as const;
export type FoodCategory = typeof foodCategories[number];

export const insertFoodSchema = z.object({
  name: z.string().min(1),
  category: z.enum(foodCategories),
  priceCents: z.number().int().positive(),
  description: z.string().optional(),
});

export type InsertFood = z.infer<typeof insertFoodSchema>;

export interface Food extends InsertFood {
  id: string;
}

export interface FoodFilters {
  search?: string;
  category?: FoodCategory;
}
