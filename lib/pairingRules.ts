export interface PairingCandidate {
  name: string;
  score: number;
  reasons: string[];
  category: string;
  varietal?: string;
  origin?: string;
}

export interface DishInput {
  dishName: string;
  protein?: string;
  sauce?: string;
  cookingMethod?: string;
  flavorNotes: string[];
  heatLevel: number;
  sweetnessLevel: number;
  preferredColor?: string;
  budget?: number;
}

export interface WineInput {
  wineName?: string;
  varietal?: string;
  region?: string;
  sweetness?: number;
  body?: number;
  tannin?: number;
  acidity?: number;
}

const wineColorKeywords: Record<string, string[]> = {
  red: ["cabernet", "merlot", "pinot noir", "syrah", "shiraz", "malbec", "tempranillo", "sangiovese", "grenache", "zinfandel", "agiorgitiko", "monastrell"],
  white: ["chardonnay", "sauvignon blanc", "riesling", "pinot grigio", "pinot gris", "gewurztraminer", "viognier", "albarino", "assyrtiko", "insolia", "bordeaux blanc"],
  rose: ["rose", "rosé", "rosato"],
  sparkling: ["champagne", "prosecco", "cava", "cremant", "brut", "sparkling"],
};

const proteinWinePairings: Record<string, { reds: string[]; whites: string[]; notes: string }> = {
  beef: {
    reds: ["Cabernet Sauvignon", "Malbec", "Shiraz", "Syrah", "Tempranillo"],
    whites: [],
    notes: "Bold reds with firm tannins complement rich beef flavors",
  },
  lamb: {
    reds: ["Cabernet Sauvignon", "Syrah", "Grenache", "Tempranillo", "Malbec"],
    whites: [],
    notes: "Full-bodied reds with earthy notes pair well with lamb",
  },
  pork: {
    reds: ["Pinot Noir", "Grenache", "Tempranillo"],
    whites: ["Chardonnay", "Riesling", "Pinot Grigio"],
    notes: "Medium-bodied wines complement pork's versatility",
  },
  poultry: {
    reds: ["Pinot Noir", "Grenache", "Gamay"],
    whites: ["Chardonnay", "Sauvignon Blanc", "Riesling", "Pinot Grigio"],
    notes: "Light to medium wines work well with poultry",
  },
  fish: {
    reds: ["Pinot Noir"],
    whites: ["Sauvignon Blanc", "Chardonnay", "Pinot Grigio", "Albarino", "Riesling"],
    notes: "Crisp whites and light reds complement delicate fish",
  },
  shellfish: {
    reds: [],
    whites: ["Sauvignon Blanc", "Champagne", "Cava", "Muscadet", "Albarino"],
    notes: "Bright, acidic wines cut through shellfish richness",
  },
  veg: {
    reds: ["Pinot Noir", "Grenache"],
    whites: ["Sauvignon Blanc", "Riesling", "Pinot Grigio", "Vermentino"],
    notes: "Fresh, herbaceous wines complement vegetable dishes",
  },
  cheese: {
    reds: ["Cabernet Sauvignon", "Tempranillo", "Port"],
    whites: ["Chardonnay", "Riesling", "Gewurztraminer"],
    notes: "Match wine intensity to cheese strength",
  },
};

const flavorPairings: Record<string, { wines: string[]; avoid: string[]; note: string }> = {
  spicy: {
    wines: ["Riesling", "Gewurztraminer", "Prosecco", "Rosé"],
    avoid: ["Cabernet Sauvignon", "High-tannin reds"],
    note: "Off-dry wines with lower alcohol tame spice",
  },
  creamy: {
    wines: ["Chardonnay", "Champagne", "Viognier"],
    avoid: ["High-acid whites"],
    note: "Rich, buttery wines complement creamy sauces",
  },
  smoky: {
    wines: ["Syrah", "Shiraz", "Malbec", "Oak-aged wines"],
    avoid: ["Delicate whites"],
    note: "Wines with smoky, earthy notes echo grilled flavors",
  },
  citrus: {
    wines: ["Sauvignon Blanc", "Albarino", "Vermentino", "Champagne"],
    avoid: ["Heavy reds"],
    note: "Bright, citrusy wines mirror citrus flavors",
  },
  herbaceous: {
    wines: ["Sauvignon Blanc", "Vermentino", "Grüner Veltliner"],
    avoid: ["Oaky wines"],
    note: "Herbaceous wines complement fresh herbs",
  },
  sweet: {
    wines: ["Riesling", "Moscato", "Late Harvest wines"],
    avoid: ["Dry tannic reds"],
    note: "Match or exceed dish sweetness",
  },
  umami: {
    wines: ["Pinot Noir", "Nebbiolo", "Aged wines", "Champagne"],
    avoid: ["Very young wines"],
    note: "Aged wines with complexity complement umami",
  },
};

const cookingMethodPairings: Record<string, { wines: string[]; note: string }> = {
  grilled: {
    wines: ["Cabernet Sauvignon", "Malbec", "Syrah", "Zinfandel"],
    note: "Bold wines match charred, smoky flavors",
  },
  roasted: {
    wines: ["Chardonnay", "Pinot Noir", "Merlot"],
    note: "Medium-bodied wines for caramelized flavors",
  },
  fried: {
    wines: ["Champagne", "Prosecco", "Sauvignon Blanc"],
    note: "Bubbles and acidity cut through oil",
  },
  braised: {
    wines: ["Pinot Noir", "Grenache", "Côtes du Rhône"],
    note: "Earthy wines complement slow-cooked dishes",
  },
  raw: {
    wines: ["Champagne", "Chablis", "Sauvignon Blanc"],
    note: "Crisp, clean wines for raw preparations",
  },
  steamed: {
    wines: ["Riesling", "Pinot Grigio", "Muscadet"],
    note: "Light wines for delicate preparations",
  },
};

export function getWineRecommendations(input: DishInput, wines: Array<{ name: string; grape: string; category: string; origin: string; price: number; notes: string }>): PairingCandidate[] {
  const candidates: Map<string, PairingCandidate> = new Map();

  for (const wine of wines) {
    const candidate: PairingCandidate = {
      name: wine.name,
      score: 50,
      reasons: [],
      category: wine.category,
      varietal: wine.grape,
      origin: wine.origin,
    };

    if (input.preferredColor && input.preferredColor !== "any") {
      const wineCategory = wine.category.toLowerCase();
      const preferredLower = input.preferredColor.toLowerCase();
      
      if (preferredLower === "red" && wineCategory === "red") {
        candidate.score += 15;
        candidate.reasons.push("Matches your red wine preference");
      } else if (preferredLower === "white" && wineCategory === "white") {
        candidate.score += 15;
        candidate.reasons.push("Matches your white wine preference");
      } else if (preferredLower === "rose" && wineCategory === "rosé") {
        candidate.score += 15;
        candidate.reasons.push("Matches your rosé preference");
      } else if (preferredLower === "sparkling" && wineCategory === "sparkling") {
        candidate.score += 15;
        candidate.reasons.push("Matches your sparkling preference");
      } else {
        candidate.score -= 10;
      }
    }

    if (input.protein && proteinWinePairings[input.protein]) {
      const pairing = proteinWinePairings[input.protein];
      const grapeLower = wine.grape.toLowerCase();
      
      const matchesRed = pairing.reds.some(r => grapeLower.includes(r.toLowerCase()));
      const matchesWhite = pairing.whites.some(w => grapeLower.includes(w.toLowerCase()));
      
      if (matchesRed || matchesWhite) {
        candidate.score += 20;
        candidate.reasons.push(pairing.notes);
      }
    }

    for (const flavor of input.flavorNotes) {
      const flavorLower = flavor.toLowerCase();
      if (flavorPairings[flavorLower]) {
        const pairing = flavorPairings[flavorLower];
        const grapeLower = wine.grape.toLowerCase();
        
        if (pairing.wines.some(w => grapeLower.includes(w.toLowerCase()))) {
          candidate.score += 10;
          candidate.reasons.push(pairing.note);
        }
        if (pairing.avoid.some(a => grapeLower.includes(a.toLowerCase()))) {
          candidate.score -= 15;
        }
      }
    }

    if (input.cookingMethod && cookingMethodPairings[input.cookingMethod]) {
      const pairing = cookingMethodPairings[input.cookingMethod];
      const grapeLower = wine.grape.toLowerCase();
      
      if (pairing.wines.some(w => grapeLower.includes(w.toLowerCase()))) {
        candidate.score += 10;
        candidate.reasons.push(pairing.note);
      }
    }

    if (input.heatLevel >= 3) {
      const grapeLower = wine.grape.toLowerCase();
      if (grapeLower.includes("riesling") || grapeLower.includes("gewurz")) {
        candidate.score += 15;
        candidate.reasons.push("Off-dry wines help tame spice");
      }
      if (wine.category === "Red" && !grapeLower.includes("pinot")) {
        candidate.score -= 10;
      }
    }

    if (input.sweetnessLevel >= 3) {
      const grapeLower = wine.grape.toLowerCase();
      if (grapeLower.includes("riesling") || grapeLower.includes("moscato")) {
        candidate.score += 10;
        candidate.reasons.push("Sweet wines balance sweet dishes");
      }
    }

    if (input.budget) {
      if (wine.price <= input.budget) {
        candidate.score += 5;
        candidate.reasons.push("Within your budget");
      } else if (wine.price > input.budget * 1.5) {
        candidate.score -= 10;
      }
    }

    if (candidate.reasons.length === 0) {
      candidate.reasons.push("Versatile pairing option");
    }

    candidates.set(wine.name, candidate);
  }

  return Array.from(candidates.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

export function getFoodRecommendations(input: WineInput, foods: Array<{ name: string; category: string; price: number }>): PairingCandidate[] {
  const candidates: Map<string, PairingCandidate> = new Map();

  const wineColor = detectWineColor(input.varietal || input.wineName || "");
  const wineBody = input.body || 3;
  const wineTannin = input.tannin || 3;
  const wineAcidity = input.acidity || 3;

  for (const food of foods) {
    const candidate: PairingCandidate = {
      name: food.name,
      score: 50,
      reasons: [],
      category: food.category,
    };

    const foodLower = food.name.toLowerCase();
    const categoryLower = food.category.toLowerCase();

    if (wineColor === "red") {
      if (categoryLower.includes("meat") || foodLower.includes("lamb") || foodLower.includes("beef") || foodLower.includes("steak")) {
        candidate.score += 25;
        candidate.reasons.push("Red wines pair excellently with red meats");
      }
      if (wineTannin >= 4 && (foodLower.includes("lamb") || foodLower.includes("beef"))) {
        candidate.score += 10;
        candidate.reasons.push("High tannins complement rich, fatty meats");
      }
    }

    if (wineColor === "white") {
      if (foodLower.includes("fish") || foodLower.includes("sea") || foodLower.includes("shrimp") || foodLower.includes("salmon") || foodLower.includes("branzino")) {
        candidate.score += 25;
        candidate.reasons.push("White wines are classic with seafood");
      }
      if (foodLower.includes("chicken") || foodLower.includes("joojeh")) {
        candidate.score += 15;
        candidate.reasons.push("Crisp whites complement poultry");
      }
      if (categoryLower.includes("green") || categoryLower.includes("salad")) {
        candidate.score += 15;
        candidate.reasons.push("Fresh whites pair with vegetable dishes");
      }
    }

    if (wineColor === "sparkling") {
      if (categoryLower.includes("mazze") || categoryLower.includes("spread")) {
        candidate.score += 20;
        candidate.reasons.push("Bubbles are perfect with appetizers and mezze");
      }
      if (foodLower.includes("fried") || foodLower.includes("fries")) {
        candidate.score += 15;
        candidate.reasons.push("Acidity cuts through fried foods");
      }
    }

    if (wineColor === "rose") {
      candidate.score += 10;
      candidate.reasons.push("Rosé is versatile and food-friendly");
      if (categoryLower.includes("green") || categoryLower.includes("salad")) {
        candidate.score += 10;
      }
    }

    if (wineAcidity >= 4) {
      if (foodLower.includes("hummus") || foodLower.includes("labneh") || categoryLower.includes("spread")) {
        candidate.score += 10;
        candidate.reasons.push("High acidity cuts through creamy dishes");
      }
    }

    if (candidate.reasons.length === 0) {
      candidate.reasons.push("Enjoyable pairing option");
    }

    candidates.set(food.name, candidate);
  }

  return Array.from(candidates.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

function detectWineColor(text: string): string {
  const lower = text.toLowerCase();
  
  for (const [color, keywords] of Object.entries(wineColorKeywords)) {
    if (keywords.some(k => lower.includes(k))) {
      return color;
    }
  }
  
  return "red";
}

export function explainPairing(dish: string, wine: string, reasons: string[]): string {
  const uniqueReasons = [...new Set(reasons)].slice(0, 3);
  return uniqueReasons.join(". ") + ".";
}
