import { type Wine, type InsertWine, type WineFilters, type User, type InsertUser } from "@shared/schema";
import { applyComputedFields } from "@shared/wineRules";
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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private wines: Map<string, Wine>;

  constructor() {
    this.users = new Map();
    this.wines = new Map();
    this.seedWines();
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
      
      this.wines.set(id, {
        id,
        name: wine.name,
        wineType: wine.wineType,
        varietal: wine.varietal,
        priceCents: wine.priceCents,
        description: wine.description || null,
        priceCategory: computed.priceCategory,
        foodPairings: computed.foodPairings,
      });
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
}

export const storage = new MemStorage();
