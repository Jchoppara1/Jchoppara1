export const WINE_TYPES = [
  { key: "red", label: "Red" },
  { key: "white", label: "White" },
  { key: "rose", label: "Rosé" },
  { key: "sparkling", label: "Sparkling" },
  { key: "orange", label: "Orange / Skin-contact" },
  { key: "fortified", label: "Fortified" },
  { key: "dessert", label: "Dessert / Sweet" },
  { key: "nonAlcoholic", label: "Non-alcoholic" },
] as const;

export type WineTypeKey = typeof WINE_TYPES[number]["key"];

export const WINE_TYPE_KEYS = ["red", "white", "rose", "sparkling", "orange", "fortified", "dessert", "nonAlcoholic"] as const satisfies readonly WineTypeKey[];

export const WINE_TYPE_LABELS: Record<WineTypeKey, string> = Object.fromEntries(
  WINE_TYPES.map(t => [t.key, t.label])
) as Record<WineTypeKey, string>;

export interface WineClassification {
  typePrimary: WineTypeKey;
  typeSecondary: WineTypeKey[];
  confidence: number;
  reasons: string[];
}

export interface ClassifiableWine {
  name: string;
  varietal?: string;
  description?: string;
  region?: string;
  grapes?: string[] | string;
  style?: string;
  notes?: string;
  producer?: string;
  vintage?: string;
  wineType?: string;
}

function removeDiacritics(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalize(str: string): string {
  return removeDiacritics(str.toLowerCase().trim());
}

const SPARKLING_KEYWORDS = [
  "champagne", "cava", "prosecco", "franciacorta", "sekt",
  "cremant", "crémant", "spumante", "pet-nat", "pet nat", "brut",
];

const ROSE_KEYWORDS = ["rosé", "rose"];

const ORANGE_KEYWORDS = ["orange", "skin-contact", "skin contact", "ramato"];

const FORTIFIED_KEYWORDS = [
  "port", "porto", "sherry", "madeira", "marsala", "vermouth",
  "vin doux naturel", "banyuls", "rivesaltes",
];

const DESSERT_KEYWORDS = [
  "late harvest", "icewine", "sauternes", "tokaji",
  "beerenauslese", "trockenbeerenauslese", "passito",
  "vin santo", "demi-sec", "doux",
];

const NON_ALCOHOLIC_KEYWORDS = ["non-alcoholic", "dealcoholized", "0.0"];

const RED_GRAPES = [
  "cabernet sauvignon", "merlot", "pinot noir", "syrah", "shiraz",
  "grenache", "tempranillo", "sangiovese", "nebbiolo", "malbec",
  "zinfandel", "barbera", "mourvedre", "mourvèdre", "gamay", "carmenere",
  "cabernet franc", "monastrell", "zweigelt", "agiorgitiko", "carignan",
  "cinsault", "red blend",
];

const WHITE_GRAPES = [
  "chardonnay", "sauvignon blanc", "riesling", "pinot grigio", "pinot gris",
  "chenin blanc", "albariño", "albarino", "grüner veltliner", "gruner veltliner",
  "viognier", "semillon", "sémillon", "gewurztraminer", "gewürztraminer",
  "muscadet", "vermentino", "torrontes", "garganega", "arneis", "trebbiano",
  "fiano", "assyrtiko", "malagousia", "insolia", "glera", "moschofilero",
  "clairette", "bordeaux blanc", "white blend", "sancerre", "cava blend",
  "mauzac", "obediah",
];

const SPARKLING_REGIONS = ["champagne"];
const DESSERT_REGIONS = ["sauternes", "tokaj"];
const FORTIFIED_REGIONS = ["jerez", "montilla-moriles", "madeira"];

function containsKeyword(text: string, keywords: string[]): string | null {
  for (const kw of keywords) {
    if (text.includes(kw)) return kw;
  }
  return null;
}

function grapeIsRed(grape: string): boolean {
  const g = normalize(grape);
  return RED_GRAPES.some(rg => g.includes(rg));
}

function grapeIsWhite(grape: string): boolean {
  const g = normalize(grape);
  return WHITE_GRAPES.some(wg => g.includes(wg));
}

export function classifyWine(wine: ClassifiableWine): WineClassification {
  const reasons: string[] = [];
  const parts: string[] = [];

  if (wine.name) parts.push(wine.name);
  if (wine.description) parts.push(wine.description);
  if (wine.region) parts.push(wine.region);
  if (wine.style) parts.push(wine.style);
  if (wine.notes) parts.push(wine.notes);
  if (wine.producer) parts.push(wine.producer);

  const grapeStr = Array.isArray(wine.grapes)
    ? wine.grapes.join(", ")
    : wine.grapes || wine.varietal || "";
  parts.push(grapeStr);

  const searchText = normalize(parts.join(" "));

  let match: string | null;

  match = containsKeyword(searchText, NON_ALCOHOLIC_KEYWORDS);
  if (match) {
    reasons.push(`keyword:${match}`);
    return { typePrimary: "nonAlcoholic", typeSecondary: [], confidence: 0.95, reasons };
  }

  match = containsKeyword(searchText, FORTIFIED_KEYWORDS);
  if (match) {
    reasons.push(`keyword:${match}`);
    return { typePrimary: "fortified", typeSecondary: [], confidence: 0.95, reasons };
  }

  match = containsKeyword(searchText, DESSERT_KEYWORDS);
  if (match) {
    reasons.push(`keyword:${match}`);
    return { typePrimary: "dessert", typeSecondary: [], confidence: 0.9, reasons };
  }

  match = containsKeyword(searchText, ORANGE_KEYWORDS);
  if (match) {
    reasons.push(`keyword:${match}`);
    return { typePrimary: "orange", typeSecondary: [], confidence: 0.9, reasons };
  }

  const sparklingMatch = containsKeyword(searchText, SPARKLING_KEYWORDS);
  const roseMatch = containsKeyword(searchText, ROSE_KEYWORDS);

  if (sparklingMatch) {
    reasons.push(`keyword:${sparklingMatch}`);
    if (roseMatch) {
      reasons.push(`keyword:${roseMatch}`);
    }
    return { typePrimary: "sparkling", typeSecondary: roseMatch ? ["rose"] : [], confidence: 0.95, reasons };
  }

  if (roseMatch) {
    reasons.push(`keyword:${roseMatch}`);
    return { typePrimary: "rose", typeSecondary: [], confidence: 0.9, reasons };
  }

  for (const region of SPARKLING_REGIONS) {
    if (searchText.includes(region)) {
      reasons.push(`region:${region}`);
      return { typePrimary: "sparkling", typeSecondary: [], confidence: 0.85, reasons };
    }
  }

  for (const region of DESSERT_REGIONS) {
    if (searchText.includes(region)) {
      reasons.push(`region:${region}`);
      return { typePrimary: "dessert", typeSecondary: [], confidence: 0.85, reasons };
    }
  }

  for (const region of FORTIFIED_REGIONS) {
    if (searchText.includes(region)) {
      reasons.push(`region:${region}`);
      return { typePrimary: "fortified", typeSecondary: [], confidence: 0.85, reasons };
    }
  }

  const grapeList = grapeStr.split(/,\s*/).map(g => g.trim()).filter(Boolean);
  let redCount = 0;
  let whiteCount = 0;
  const matchedGrapes: string[] = [];

  for (const grape of grapeList) {
    if (grapeIsRed(grape)) {
      redCount++;
      matchedGrapes.push(normalize(grape));
    } else if (grapeIsWhite(grape)) {
      whiteCount++;
      matchedGrapes.push(normalize(grape));
    }
  }

  if (redCount > 0 || whiteCount > 0) {
    if (redCount > whiteCount) {
      reasons.push(`grape:${matchedGrapes[0]}`);
      return { typePrimary: "red", typeSecondary: [], confidence: 0.8, reasons };
    } else if (whiteCount > redCount) {
      reasons.push(`grape:${matchedGrapes[0]}`);
      return { typePrimary: "white", typeSecondary: [], confidence: 0.8, reasons };
    }
    reasons.push(`grape:${matchedGrapes[0]}`);
    return { typePrimary: "red", typeSecondary: ["white"], confidence: 0.6, reasons };
  }

  if (searchText.includes("rouge") || searchText.includes("rosso")) {
    reasons.push("language:rouge/rosso");
    return { typePrimary: "red", typeSecondary: [], confidence: 0.7, reasons };
  }

  if (searchText.includes("blanc") || searchText.includes("bianco")) {
    reasons.push("language:blanc/bianco");
    return { typePrimary: "white", typeSecondary: [], confidence: 0.7, reasons };
  }

  if (wine.wineType) {
    const wt = normalize(wine.wineType);
    const fallbackMap: Record<string, WineTypeKey> = {
      red: "red", white: "white", "rosé": "rose", rose: "rose",
      sparkling: "sparkling", amber: "orange",
    };
    const mapped = fallbackMap[wt];
    if (mapped) {
      reasons.push(`fallback:wineType=${wine.wineType}`);
      return { typePrimary: mapped, typeSecondary: [], confidence: 0.5, reasons };
    }
  }

  reasons.push("default:red");
  return { typePrimary: "red", typeSecondary: [], confidence: 0.3, reasons };
}

export function wineTypeKeyToDisplay(key: WineTypeKey): string {
  return WINE_TYPE_LABELS[key] || key;
}

export function displayToWineTypeKey(display: string): WineTypeKey {
  const normalized = normalize(display);
  for (const wt of WINE_TYPES) {
    if (normalize(wt.label) === normalized || wt.key === normalized) {
      return wt.key;
    }
  }
  if (normalized === "red") return "red";
  if (normalized === "white") return "white";
  if (normalized === "rosé" || normalized === "rose") return "rose";
  if (normalized === "sparkling") return "sparkling";
  return "red";
}
