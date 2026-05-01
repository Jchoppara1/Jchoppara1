import { Router, type IRouter } from "express";
import { storage } from "../storage";
import { insertWineSchema, wineFiltersSchema } from "../shared/schema";
import { foodCategories } from "../shared/foodSchema";
import { z } from "zod/v4";
import { registerAdminRoutes, bootstrapAdmin } from "../adminRoutes";

const foodFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.enum(foodCategories).optional(),
});

const router: IRouter = Router();

export async function bootstrapDelbar() {
  await bootstrapAdmin();
}

export function registerDelbarRoutes(app: IRouter) {
  registerAdminRoutes(app);
  
  app.get("/wines", async (req, res) => {
    try {
      const filters = wineFiltersSchema.parse({
        search: req.query.search || undefined,
        wineType: req.query.wineType || undefined,
        priceCategory: req.query.priceCategory || undefined,
        foodPairing: req.query.foodPairing || undefined,
      });
      
      const wines = await storage.listWines(filters);
      const enriched = wines.map(wine => ({
        ...wine,
        profile: storage.getWineProfile(wine.id, "bottle"),
        wineDescription: storage.getWineDescription(wine.id, "bottle"),
      }));
      res.json(enriched);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid filter parameters", details: error.issues });
      } else {
        res.status(500).json({ error: "Failed to fetch wines" });
      }
    }
  });

  app.get("/wines/:id", async (req, res) => {
    try {
      const wine = await storage.getWine(req.params.id);
      if (!wine) {
        return res.status(404).json({ error: "Wine not found" });
      }
      res.json(wine);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wine" });
    }
  });

  app.post("/wines", async (req, res) => {
    try {
      const validated = insertWineSchema.parse(req.body);
      const wine = await storage.createWine(validated);
      res.status(201).json(wine);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid wine data", details: error.issues });
      } else {
        res.status(500).json({ error: "Failed to create wine" });
      }
    }
  });

  app.patch("/wines/:id", async (req, res) => {
    try {
      const validated = insertWineSchema.partial().parse(req.body);
      const wine = await storage.updateWine(req.params.id, validated);
      if (!wine) {
        return res.status(404).json({ error: "Wine not found" });
      }
      res.json(wine);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid wine data", details: error.issues });
      } else {
        res.status(500).json({ error: "Failed to update wine" });
      }
    }
  });

  app.delete("/wines/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteWine(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Wine not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete wine" });
    }
  });

  // Wines by glass endpoints
  app.get("/wines-by-glass", async (req, res) => {
    try {
      const filters = wineFiltersSchema.parse({
        search: req.query.search || undefined,
        wineType: req.query.wineType || undefined,
        priceCategory: req.query.priceCategory || undefined,
        foodPairing: req.query.foodPairing || undefined,
      });
      
      const wines = await storage.listWinesByGlass(filters);
      const enriched = wines.map(wine => ({
        ...wine,
        profile: storage.getWineProfile(wine.id, "glass"),
        wineDescription: storage.getWineDescription(wine.id, "glass"),
      }));
      res.json(enriched);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid filter parameters", details: error.issues });
      } else {
        res.status(500).json({ error: "Failed to fetch wines by glass" });
      }
    }
  });

  app.get("/wines-by-glass/:id", async (req, res) => {
    try {
      const wine = await storage.getWineByGlass(req.params.id);
      if (!wine) {
        return res.status(404).json({ error: "Wine not found" });
      }
      res.json(wine);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wine by glass" });
    }
  });

  // Food endpoints
  app.get("/foods", async (req, res) => {
    try {
      const filters = foodFiltersSchema.parse({
        search: req.query.search || undefined,
        category: req.query.category || undefined,
      });
      
      const foods = await storage.listFoods(filters);
      res.json(foods);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid filter parameters", details: error.issues });
      } else {
        res.status(500).json({ error: "Failed to fetch foods" });
      }
    }
  });

  app.get("/foods/:id", async (req, res) => {
    try {
      const food = await storage.getFood(req.params.id);
      if (!food) {
        return res.status(404).json({ error: "Food not found" });
      }
      res.json(food);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch food" });
    }
  });

  app.get("/wines/:id/profile", async (req, res) => {
    const listType = (req.query.list as string) === "glass" ? "glass" : "bottle";
    const profile = storage.getWineProfile(req.params.id, listType);
    const description = storage.getWineDescription(req.params.id, listType);
    if (!profile) return res.status(404).json({ error: "Wine profile not found" });
    res.json({ profile, description });
  });

  app.get("/wines/:id/pairings", async (req, res) => {
    const listType = (req.query.list as string) === "glass" ? "glass" : "bottle";
    const mode = (req.query.mode as string) === "adventurous" ? "adventurous" : "classic";
    const pairings = storage.getPairingsForWine(req.params.id, listType, mode);
    res.json(pairings.map(p => ({
      food: p.food,
      score: p.score,
      matchScore: p.matchScore,
      confidenceTier: p.confidenceTier,
      confidenceLevel: p.confidenceLevel,
      explanation: p.explanation,
      whyItWorks: p.whyItWorks,
    })));
  });

  app.get("/foods/:id/pairings", async (req, res) => {
    const listType = (req.query.list as string) === "glass" ? "glass" : "bottle";
    const mode = (req.query.mode as string) === "adventurous" ? "adventurous" : "classic";
    const pairings = storage.getPairingsForFood(req.params.id, listType, mode);
    res.json(pairings.map(p => ({
      wine: p.wine,
      score: p.score,
      matchScore: p.matchScore,
      confidenceTier: p.confidenceTier,
      confidenceLevel: p.confidenceLevel,
      explanation: p.explanation,
      whyItWorks: p.whyItWorks,
      reasonHighlights: p.reasonHighlights,
      avoidNote: p.avoidNote,
      breakdown: p.breakdown,
    })));
  });

  app.get("/foods/:id/dish-profile", async (req, res) => {
    const profile = storage.getDishProfile(req.params.id);
    if (!profile) return res.status(404).json({ error: "Dish profile not found" });
    res.json(profile);
  });

}

export default router;
