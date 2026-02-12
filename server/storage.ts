import { type Wine, type InsertWine, type WineFilters, type User, type InsertUser } from "@shared/schema";
import { type Food, type InsertFood, type FoodFilters, type FoodCategory } from "@shared/foodSchema";
import { applyComputedFields } from "@shared/wineRules";
import { inferWineProfile, buildWineDescription, getPriceTierFromPercentile, type WineProfile, type WineDescription } from "@shared/wineProfile";
import { rankWinesForFood, rankFoodsForWine, inferDishProfile, type PairingResult, type FoodPairingResult, type DishProfile } from "@shared/pairingEngine";
import { randomUUID } from "crypto";
import * as fs from "fs";
import * as path from "path";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  listWines(filters?: WineFilters): Promise<Wine[]>;
  getWine(id: string): Promise<Wine | undefined>;
  createWine(wine: InsertWine): Promise<Wine>;
  updateWine(id: string, wine: Partial<InsertWine>): Promise<Wine | undefined>;
  deleteWine(id: string): Promise<boolean>;

  listWinesByGlass(filters?: WineFilters): Promise<Wine[]>;
  getWineByGlass(id: string): Promise<Wine | undefined>;

  listFoods(filters?: FoodFilters): Promise<Food[]>;
  getFood(id: string): Promise<Food | undefined>;

  getWineProfile(wineId: string, listType?: "bottle" | "glass"): WineProfile | undefined;
  getWineDescription(wineId: string, listType?: "bottle" | "glass"): WineDescription | undefined;
  getPairingsForFood(foodId: string, listType: "bottle" | "glass", mode: "classic" | "adventurous"): PairingResult[];
  getPairingsForWine(wineId: string, listType: "bottle" | "glass", mode: "classic" | "adventurous"): FoodPairingResult[];
  getDishProfile(foodId: string): DishProfile | undefined;
  getAllBottlePrices(): number[];
  getAllGlassPrices(): number[];
}

function parseCSV(content: string): Record<string, string>[] {
  const lines = content.trim().split('\n');
  const headers = parseCSVLine(lines[0]);
  const records: Record<string, string>[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const record: Record<string, string> = {};
      headers.forEach((header, index) => {
        record[header.trim()] = values[index];
      });
      records.push(record);
    }
  }
  return records;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function mapCategoryToWineType(category: string): "Red" | "White" | "Rosé" | "Sparkling" {
  const normalized = category.trim();
  if (normalized === "Red") return "Red";
  if (normalized === "White") return "White";
  if (normalized === "Rosé") return "Rosé";
  if (normalized === "Sparkling") return "Sparkling";
  if (normalized === "Amber") return "White"; // Amber/orange wines are made from white grapes
  return "Red"; // Default fallback
}

function loadWinesFromCSV(): Omit<InsertWine, "id">[] {
  const csvPath = path.join(process.cwd(), 'delbarcsv', 'wine_list.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.warn(`CSV file not found at ${csvPath}, using empty wine list`);
    return [];
  }
  
  const content = fs.readFileSync(csvPath, 'utf-8');
  const records = parseCSV(content);
  
  return records.map(record => ({
    name: record.name || 'Unknown Wine',
    wineType: mapCategoryToWineType(record.category),
    varietal: record.grape || 'Unknown',
    priceCents: Math.round(parseFloat(record.price || '0') * 100),
    description: record.origin 
      ? `${record.notes || ''} (${record.origin})`
      : record.notes || undefined,
  }));
}

function mapCategoryToFoodCategory(category: string): FoodCategory {
  const normalized = category.trim();
  if (normalized === "Mazzes") return "Mazzes";
  if (normalized === "Spreads") return "Spreads";
  if (normalized === "Greens & Grains") return "Greens & Grains";
  if (normalized === "Meats & Seafood") return "Meats & Seafood";
  return "Meats & Seafood"; // Default fallback
}

function loadWinesByGlassFromCSV(): Omit<InsertWine, "id">[] {
  const csvPath = path.join(process.cwd(), 'attached_assets', 'wines_by_glass.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.warn(`CSV file not found at ${csvPath}, using empty glass wine list`);
    return [];
  }
  
  const content = fs.readFileSync(csvPath, 'utf-8');
  const records = parseCSV(content);
  
  return records.map(record => ({
    name: record.name || 'Unknown Wine',
    wineType: mapCategoryToWineType(record.wineType),
    varietal: record.varietal || 'Unknown',
    priceCents: parseInt(record.priceCents || '0', 10),
    description: record.origin 
      ? `${record.description || ''} (${record.origin})`
      : record.description || undefined,
  }));
}

function loadFoodsFromCSV(): Omit<InsertFood, "id">[] {
  const csvPath = path.join(process.cwd(), 'delbarcsv', 'food_menu.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.warn(`CSV file not found at ${csvPath}, using empty food list`);
    return [];
  }
  
  const content = fs.readFileSync(csvPath, 'utf-8');
  const records = parseCSV(content);
  
  return records.map(record => ({
    name: record.name || 'Unknown Dish',
    category: mapCategoryToFoodCategory(record.category),
    priceCents: Math.round(parseFloat(record.price || '0') * 100),
  }));
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private wines: Map<string, Wine>;
  private winesByGlass: Map<string, Wine>;
  private foods: Map<string, Food>;
  private wineProfiles: Map<string, WineProfile>;
  private wineDescriptions: Map<string, WineDescription>;
  private pairingCache: Map<string, any>;

  constructor() {
    this.users = new Map();
    this.wines = new Map();
    this.winesByGlass = new Map();
    this.foods = new Map();
    this.wineProfiles = new Map();
    this.wineDescriptions = new Map();
    this.pairingCache = new Map();
    this.seedWines();
    this.seedWinesByGlass();
    this.seedFoods();
    this.recomputePriceTiers();
  }

  private recomputePriceTiers() {
    const bottlePrices = Array.from(this.wines.values()).map(w => w.priceCents);
    for (const [id, wine] of this.wines) {
      const tier = getPriceTierFromPercentile(wine.priceCents, bottlePrices);
      this.wines.set(id, { ...wine, priceCategory: tier });
    }

    const glassPrices = Array.from(this.winesByGlass.values()).map(w => w.priceCents);
    for (const [id, wine] of this.winesByGlass) {
      const tier = getPriceTierFromPercentile(wine.priceCents, glassPrices);
      this.winesByGlass.set(id, { ...wine, priceCategory: tier });
    }
  }

  private computeProfileAndDescription(wine: Wine): void {
    const profile = inferWineProfile(wine);
    const description = buildWineDescription(wine, profile);
    this.wineProfiles.set(wine.id, profile);
    this.wineDescriptions.set(wine.id, description);
  }

  private seedWines() {
    const wines = loadWinesFromCSV();
    console.log(`Loaded ${wines.length} wines from CSV`);
    
    for (const wine of wines) {
      const id = randomUUID();
      const computed = applyComputedFields({
        wineType: wine.wineType as any,
        varietal: wine.varietal,
        priceCents: wine.priceCents,
      });
      
      const wineObj: Wine = {
        id,
        name: wine.name,
        wineType: wine.wineType,
        varietal: wine.varietal,
        priceCents: wine.priceCents,
        description: wine.description || null,
        priceCategory: computed.priceCategory,
        foodPairings: computed.foodPairings,
      };
      this.wines.set(id, wineObj);
      this.computeProfileAndDescription(wineObj);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async listWines(filters?: WineFilters): Promise<Wine[]> {
    let wines = Array.from(this.wines.values());
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      wines = wines.filter(
        (wine) =>
          wine.name.toLowerCase().includes(search) ||
          wine.varietal.toLowerCase().includes(search) ||
          wine.description?.toLowerCase().includes(search)
      );
    }
    
    if (filters?.wineType) {
      wines = wines.filter((wine) => wine.wineType === filters.wineType);
    }
    
    if (filters?.priceCategory) {
      wines = wines.filter((wine) => wine.priceCategory === filters.priceCategory);
    }
    
    if (filters?.foodPairing) {
      wines = wines.filter((wine) => 
        wine.foodPairings.includes(filters.foodPairing!)
      );
    }
    
    return wines.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getWine(id: string): Promise<Wine | undefined> {
    return this.wines.get(id);
  }

  async createWine(insertWine: InsertWine): Promise<Wine> {
    const id = randomUUID();
    const computed = applyComputedFields({
      wineType: insertWine.wineType as any,
      varietal: insertWine.varietal,
      priceCents: insertWine.priceCents,
    });
    
    const wine: Wine = {
      id,
      name: insertWine.name,
      wineType: insertWine.wineType,
      varietal: insertWine.varietal,
      priceCents: insertWine.priceCents,
      description: insertWine.description || null,
      priceCategory: computed.priceCategory,
      foodPairings: computed.foodPairings,
    };
    
    this.wines.set(id, wine);
    return wine;
  }

  async updateWine(id: string, updates: Partial<InsertWine>): Promise<Wine | undefined> {
    const existing = this.wines.get(id);
    if (!existing) return undefined;
    
    const updated = {
      ...existing,
      ...updates,
      description: updates.description !== undefined ? updates.description || null : existing.description,
    };
    
    const computed = applyComputedFields({
      wineType: updated.wineType as any,
      varietal: updated.varietal,
      priceCents: updated.priceCents,
    });
    
    const wine: Wine = {
      ...updated,
      priceCategory: computed.priceCategory,
      foodPairings: computed.foodPairings,
    };
    
    this.wines.set(id, wine);
    return wine;
  }

  async deleteWine(id: string): Promise<boolean> {
    return this.wines.delete(id);
  }

  private seedWinesByGlass() {
    const wines = loadWinesByGlassFromCSV();
    console.log(`Loaded ${wines.length} wines by glass from CSV`);
    
    for (const wine of wines) {
      const id = randomUUID();
      const computed = applyComputedFields({
        wineType: wine.wineType as any,
        varietal: wine.varietal,
        priceCents: wine.priceCents,
      });
      
      const wineObj: Wine = {
        id,
        name: wine.name,
        wineType: wine.wineType,
        varietal: wine.varietal,
        priceCents: wine.priceCents,
        description: wine.description || null,
        priceCategory: computed.priceCategory,
        foodPairings: computed.foodPairings,
      };
      this.winesByGlass.set(id, wineObj);
      this.computeProfileAndDescription(wineObj);
    }
  }

  async listWinesByGlass(filters?: WineFilters): Promise<Wine[]> {
    let wines = Array.from(this.winesByGlass.values());
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      wines = wines.filter(
        (wine) =>
          wine.name.toLowerCase().includes(search) ||
          wine.varietal.toLowerCase().includes(search) ||
          wine.description?.toLowerCase().includes(search)
      );
    }
    
    if (filters?.wineType) {
      wines = wines.filter((wine) => wine.wineType === filters.wineType);
    }
    
    if (filters?.priceCategory) {
      wines = wines.filter((wine) => wine.priceCategory === filters.priceCategory);
    }
    
    if (filters?.foodPairing) {
      wines = wines.filter((wine) => 
        wine.foodPairings.includes(filters.foodPairing!)
      );
    }
    
    return wines.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getWineByGlass(id: string): Promise<Wine | undefined> {
    return this.winesByGlass.get(id);
  }

  private seedFoods() {
    const foods = loadFoodsFromCSV();
    console.log(`Loaded ${foods.length} foods from CSV`);
    
    for (const food of foods) {
      const id = randomUUID();
      this.foods.set(id, {
        id,
        name: food.name,
        category: food.category,
        priceCents: food.priceCents,
      });
    }
  }

  async listFoods(filters?: FoodFilters): Promise<Food[]> {
    let foods = Array.from(this.foods.values());
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      foods = foods.filter(
        (food) => food.name.toLowerCase().includes(search)
      );
    }
    
    if (filters?.category) {
      foods = foods.filter((food) => food.category === filters.category);
    }
    
    return foods.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getFood(id: string): Promise<Food | undefined> {
    return this.foods.get(id);
  }

  getWineProfile(wineId: string, listType: "bottle" | "glass" = "bottle"): WineProfile | undefined {
    return this.wineProfiles.get(wineId);
  }

  getWineDescription(wineId: string, listType: "bottle" | "glass" = "bottle"): WineDescription | undefined {
    return this.wineDescriptions.get(wineId);
  }

  getPairingsForFood(foodId: string, listType: "bottle" | "glass" = "bottle", mode: "classic" | "adventurous" = "classic"): PairingResult[] {
    const food = this.foods.get(foodId);
    if (!food) return [];

    const allWines = listType === "glass"
      ? Array.from(this.winesByGlass.values())
      : Array.from(this.wines.values());

    return rankWinesForFood(food, allWines, mode, 4);
  }

  getPairingsForWine(wineId: string, listType: "bottle" | "glass" = "bottle", mode: "classic" | "adventurous" = "classic"): FoodPairingResult[] {
    const wine = listType === "glass"
      ? this.winesByGlass.get(wineId)
      : this.wines.get(wineId);
    if (!wine) return [];

    const allFoods = Array.from(this.foods.values());
    return rankFoodsForWine(wine, allFoods, mode, 4);
  }

  getDishProfile(foodId: string): DishProfile | undefined {
    const food = this.foods.get(foodId);
    if (!food) return undefined;
    return inferDishProfile(food);
  }

  getAllBottlePrices(): number[] {
    return Array.from(this.wines.values()).map(w => w.priceCents);
  }

  getAllGlassPrices(): number[] {
    return Array.from(this.winesByGlass.values()).map(w => w.priceCents);
  }
}

export const storage = new MemStorage();
