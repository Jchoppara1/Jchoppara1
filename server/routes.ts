import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWineSchema, wineFiltersSchema } from "@shared/schema";
import { foodCategories } from "@shared/foodSchema";
import { z } from "zod";

const foodFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.enum(foodCategories).optional(),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/wines", async (req, res) => {
    try {
      const filters = wineFiltersSchema.parse({
        search: req.query.search || undefined,
        wineType: req.query.wineType || undefined,
        priceCategory: req.query.priceCategory || undefined,
        foodPairing: req.query.foodPairing || undefined,
      });
      
      const wines = await storage.listWines(filters);
      res.json(wines);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid filter parameters", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to fetch wines" });
      }
    }
  });

  app.get("/api/wines/:id", async (req, res) => {
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

  app.post("/api/wines", async (req, res) => {
    try {
      const validated = insertWineSchema.parse(req.body);
      const wine = await storage.createWine(validated);
      res.status(201).json(wine);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid wine data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create wine" });
      }
    }
  });

  app.patch("/api/wines/:id", async (req, res) => {
    try {
      const validated = insertWineSchema.partial().parse(req.body);
      const wine = await storage.updateWine(req.params.id, validated);
      if (!wine) {
        return res.status(404).json({ error: "Wine not found" });
      }
      res.json(wine);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid wine data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update wine" });
      }
    }
  });

  app.delete("/api/wines/:id", async (req, res) => {
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
  app.get("/api/wines-by-glass", async (req, res) => {
    try {
      const filters = wineFiltersSchema.parse({
        search: req.query.search || undefined,
        wineType: req.query.wineType || undefined,
        priceCategory: req.query.priceCategory || undefined,
        foodPairing: req.query.foodPairing || undefined,
      });
      
      const wines = await storage.listWinesByGlass(filters);
      res.json(wines);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid filter parameters", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to fetch wines by glass" });
      }
    }
  });

  app.get("/api/wines-by-glass/:id", async (req, res) => {
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
  app.get("/api/foods", async (req, res) => {
    try {
      const filters = foodFiltersSchema.parse({
        search: req.query.search || undefined,
        category: req.query.category || undefined,
      });
      
      const foods = await storage.listFoods(filters);
      res.json(foods);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid filter parameters", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to fetch foods" });
      }
    }
  });

  app.get("/api/foods/:id", async (req, res) => {
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

  return httpServer;
}
