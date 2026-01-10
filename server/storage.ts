import { type Wine, type InsertWine, type WineFilters, type User, type InsertUser } from "@shared/schema";
import { applyComputedFields } from "@shared/wineRules";
import { randomUUID } from "crypto";

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

const exampleWines: Omit<InsertWine, "id">[] = [
  {
    name: "Château Margaux 2015",
    wineType: "Red",
    varietal: "Cabernet Sauvignon",
    priceCents: 45000,
    description: "A legendary Bordeaux with incredible depth, featuring notes of blackcurrant, violet, and subtle oak. Exceptional aging potential.",
  },
  {
    name: "Opus One 2018",
    wineType: "Red",
    varietal: "Cabernet Sauvignon",
    priceCents: 38500,
    description: "A harmonious blend from Napa Valley, showcasing dark fruit, espresso, and velvety tannins.",
  },
  {
    name: "Cloudy Bay Sauvignon Blanc 2022",
    wineType: "White",
    varietal: "Sauvignon Blanc",
    priceCents: 2800,
    description: "Crisp and refreshing New Zealand white with vibrant citrus and tropical fruit notes.",
  },
  {
    name: "Domaine Leflaive Puligny-Montrachet 2020",
    wineType: "White",
    varietal: "Chardonnay",
    priceCents: 12500,
    description: "Elegant Burgundy white with mineral complexity, honeyed notes, and impeccable balance.",
  },
  {
    name: "Whispering Angel Rosé 2023",
    wineType: "Rosé",
    varietal: "Grenache",
    priceCents: 2200,
    description: "A pale and delicate Provence rosé with hints of strawberry, peach, and Mediterranean herbs.",
  },
  {
    name: "Dom Pérignon 2012",
    wineType: "Sparkling",
    varietal: "Champagne",
    priceCents: 22000,
    description: "The legendary prestige cuvée with fine bubbles, brioche notes, and remarkable precision.",
  },
  {
    name: "Penfolds Grange 2017",
    wineType: "Red",
    varietal: "Shiraz",
    priceCents: 75000,
    description: "Australia's most iconic wine with intense dark fruit, chocolate, and exceptional structure.",
  },
  {
    name: "Dr. Loosen Riesling Spätlese 2021",
    wineType: "White",
    varietal: "Riesling",
    priceCents: 2400,
    description: "Off-dry German Riesling with vibrant acidity, stone fruit, and honeyed minerality.",
  },
  {
    name: "Caymus Cabernet Sauvignon 2020",
    wineType: "Red",
    varietal: "Cabernet Sauvignon",
    priceCents: 8500,
    description: "Rich and full-bodied Napa Cab with ripe blackberry, cocoa, and vanilla notes.",
  },
  {
    name: "Miraval Rosé 2023",
    wineType: "Rosé",
    varietal: "Cinsault",
    priceCents: 2600,
    description: "Elegant Côtes de Provence rosé with fresh red berries and crisp minerality.",
  },
  {
    name: "Veuve Clicquot Yellow Label",
    wineType: "Sparkling",
    varietal: "Champagne",
    priceCents: 5500,
    description: "Classic non-vintage Champagne with golden color, apple, and brioche characteristics.",
  },
  {
    name: "Catena Malbec 2021",
    wineType: "Red",
    varietal: "Malbec",
    priceCents: 1800,
    description: "High-altitude Argentine Malbec with plum, violet, and subtle spice notes.",
  },
];

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private wines: Map<string, Wine>;

  constructor() {
    this.users = new Map();
    this.wines = new Map();
    this.seedWines();
  }

  private seedWines() {
    for (const wine of exampleWines) {
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
