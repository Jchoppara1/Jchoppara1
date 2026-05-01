import type { IRouter, Request, Response, NextFunction } from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { adminWineUpdateSchema, adminWineCreateSchema, wineLabels } from "./shared/schema";
import { adminFoodUpdateSchema, adminFoodCreateSchema, foodLabels, foodCategories } from "./shared/foodSchema";
import { z } from "zod/v4";

declare module "express-session" {
  interface SessionData {
    adminId?: string;
    adminEmail?: string;
  }
}

const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const record = loginAttempts.get(ip);
  if (!record) return true;
  if (Date.now() - record.lastAttempt > LOCKOUT_MS) {
    loginAttempts.delete(ip);
    return true;
  }
  return record.count < MAX_ATTEMPTS;
}

function recordAttempt(ip: string) {
  const record = loginAttempts.get(ip);
  if (!record || Date.now() - record.lastAttempt > LOCKOUT_MS) {
    loginAttempts.set(ip, { count: 1, lastAttempt: Date.now() });
  } else {
    record.count++;
    record.lastAttempt = Date.now();
  }
}

function clearAttempts(ip: string) {
  loginAttempts.delete(ip);
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.adminId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

let adminPasswordHash: string | null = null;

export async function bootstrapAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn("ADMIN_EMAIL or ADMIN_PASSWORD not set. Admin login disabled.");
    return;
  }
  adminPasswordHash = await bcrypt.hash(password, 12);
  console.log(`Admin account bootstrapped for ${email}`);
}

const wineLabelsSchema = z.object({
  labels: z.array(z.enum(wineLabels)),
}).strict();

const foodLabelsSchema = z.object({
  labels: z.array(z.enum(foodLabels)),
}).strict();

const outOfStockSchema = z.object({
  outOfStock: z.boolean(),
}).strict();

export function registerAdminRoutes(app: IRouter) {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "fallback-secret-change-me",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: "lax",
      },
    })
  );

  app.post("/admin/login", async (req: Request, res: Response) => {
    const ip = req.ip || "unknown";
    if (!checkRateLimit(ip)) {
      return res.status(429).json({ error: "Too many login attempts. Try again later." });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail || !adminPasswordHash) {
      recordAttempt(ip);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (email !== adminEmail) {
      recordAttempt(ip);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, adminPasswordHash);
    if (!match) {
      recordAttempt(ip);
      return res.status(401).json({ error: "Invalid credentials" });
    }

    clearAttempts(ip);
    req.session.adminId = "admin";
    req.session.adminEmail = adminEmail;
    res.json({ ok: true, email: adminEmail });
  });

  app.post("/admin/logout", (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.json({ ok: true });
    });
  });

  app.get("/admin/me", (req: Request, res: Response) => {
    if (!req.session.adminId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    res.json({ email: req.session.adminEmail });
  });

  app.get("/admin/wines", requireAdmin, async (_req: Request, res: Response) => {
    const listType = (_req.query.list as string) === "glass" ? "glass" : "bottle";
    const wines = listType === "glass"
      ? await storage.listAllWinesByGlassAdmin()
      : await storage.listAllWinesAdmin();
    res.json(wines);
  });

  app.post("/admin/wines", requireAdmin, async (req: Request, res: Response) => {
    try {
      const listType = (req.query.list as string) === "glass" ? "glass" : "bottle";
      const validated = adminWineCreateSchema.parse(req.body);
      const wine = await storage.adminCreateWine(validated, listType);
      res.status(201).json(wine);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid wine data", details: error.issues });
      }
      res.status(500).json({ error: "Failed to create wine" });
    }
  });

  app.patch("/admin/wines/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const listType = (req.query.list as string) === "glass" ? "glass" : "bottle";
      const validated = adminWineUpdateSchema.parse(req.body);
      const wine = await storage.adminUpdateWine(req.params.id, validated, listType);
      if (!wine) return res.status(404).json({ error: "Wine not found" });
      res.json(wine);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid wine data", details: error.issues });
      }
      res.status(500).json({ error: "Failed to update wine" });
    }
  });

  app.patch("/admin/wines/:id/out-of-stock", requireAdmin, async (req: Request, res: Response) => {
    try {
      const listType = (req.query.list as string) === "glass" ? "glass" : "bottle";
      const { outOfStock } = outOfStockSchema.parse(req.body);
      const wine = await storage.adminToggleWineStock(req.params.id, outOfStock, listType);
      if (!wine) return res.status(404).json({ error: "Wine not found" });
      res.json(wine);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.issues });
      }
      res.status(500).json({ error: "Failed to update stock status" });
    }
  });

  app.patch("/admin/wines/:id/labels", requireAdmin, async (req: Request, res: Response) => {
    try {
      const listType = (req.query.list as string) === "glass" ? "glass" : "bottle";
      const { labels } = wineLabelsSchema.parse(req.body);
      const wine = await storage.adminSetWineLabels(req.params.id, labels, listType);
      if (!wine) return res.status(404).json({ error: "Wine not found" });
      res.json(wine);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid labels", details: error.issues });
      }
      res.status(500).json({ error: "Failed to update labels" });
    }
  });

  app.get("/admin/menu", requireAdmin, async (_req: Request, res: Response) => {
    const foods = await storage.listAllFoodsAdmin();
    res.json(foods);
  });

  app.post("/admin/menu", requireAdmin, async (req: Request, res: Response) => {
    try {
      const validated = adminFoodCreateSchema.parse(req.body);
      const food = await storage.adminCreateFood(validated);
      res.status(201).json(food);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid menu data", details: error.issues });
      }
      res.status(500).json({ error: "Failed to create menu item" });
    }
  });

  app.patch("/admin/menu/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const validated = adminFoodUpdateSchema.parse(req.body);
      const food = await storage.adminUpdateFood(req.params.id, validated);
      if (!food) return res.status(404).json({ error: "Menu item not found" });
      res.json(food);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid menu data", details: error.issues });
      }
      res.status(500).json({ error: "Failed to update menu item" });
    }
  });

  app.patch("/admin/menu/:id/out-of-stock", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { outOfStock } = outOfStockSchema.parse(req.body);
      const food = await storage.adminToggleFoodStock(req.params.id, outOfStock);
      if (!food) return res.status(404).json({ error: "Menu item not found" });
      res.json(food);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.issues });
      }
      res.status(500).json({ error: "Failed to update stock status" });
    }
  });

  app.patch("/admin/menu/:id/labels", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { labels } = foodLabelsSchema.parse(req.body);
      const food = await storage.adminSetFoodLabels(req.params.id, labels);
      if (!food) return res.status(404).json({ error: "Menu item not found" });
      res.json(food);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid labels", details: error.issues });
      }
      res.status(500).json({ error: "Failed to update labels" });
    }
  });
}
