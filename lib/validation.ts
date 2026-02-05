import { z } from "zod";

const emptyStringToUndefined = z.preprocess((val) => {
  if (val === "" || val === null) return undefined;
  return val;
}, z.number().min(0).optional());

const coerceNumber = z.preprocess((val) => {
  if (val === "" || val === null || val === undefined) return undefined;
  if (typeof val === "string") {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? undefined : parsed;
  }
  return val;
}, z.number().min(0).optional());

export const dishInputSchema = z.object({
  dishName: z.string().min(1, "Dish name is required"),
  protein: z.string().optional(),
  sauce: z.string().optional(),
  cookingMethod: z.string().optional(),
  flavorNotes: z.array(z.string()).default([]),
  heatLevel: z.number().min(0).max(5).default(0),
  sweetnessLevel: z.number().min(0).max(5).default(0),
  preferredColor: z.string().optional(),
  budget: coerceNumber,
});

export const wineInputSchema = z.object({
  wineName: z.string().optional(),
  varietal: z.string().optional(),
  region: z.string().optional(),
  sweetness: z.number().min(0).max(5).optional(),
  body: z.number().min(0).max(5).optional(),
  tannin: z.number().min(0).max(5).optional(),
  acidity: z.number().min(0).max(5).optional(),
});

export const pairRequestSchema = z.object({
  mode: z.enum(["dish", "wine"]),
  inputs: z.union([dishInputSchema, wineInputSchema]),
});

export type DishInputValidated = z.infer<typeof dishInputSchema>;
export type WineInputValidated = z.infer<typeof wineInputSchema>;
export type PairRequestValidated = z.infer<typeof pairRequestSchema>;
