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

export interface WineInput {
  name: string;
  producer?: string;
  vintage?: string | number;
  region?: string;
  grapes?: string[] | string;
  style?: string;
  notes?: string;
  varietal?: string;
  description?: string;
  wineType?: string;
}

export interface WineClassification {
  typePrimary: WineTypeKey;
  typeSecondary: WineTypeKey[];
  confidence: number;
  reasons: string[];
}

const SPARKLING_KEYWORDS = [
  "champagne",
  "cava",
  "prosecco",
  "franciacorta",
  "sekt",
  "cremant",
  "spumante",
  "pet-nat",
  "pet nat",
];

const ROSE_KEYWORDS = ["rosé", "rose"];
const ORANGE_KEYWORDS = ["orange", "skin-contact", "skin contact", "ramato"];

const FORTIFIED_KEYWORDS = [
  "port",
  "porto",
  "sherry",
  "madeira",
  "marsala",
  "vin doux naturel",
  "banyuls",
  "rivesaltes",
];

const DESSERT_KEYWORDS = [
  "late harvest",
  "icewine",
  "sauternes",
  "tokaji",
  "beerenauslese",
  "trockenbeerenauslese",
  "passito",
  "vin santo",
  "demi-sec",
  "doux",
];

const NON_ALCOHOLIC_KEYWORDS = [
  "non-alcoholic",
  "dealcoholized",
  "0.0",
];

const RED_GRAPES = [
  "cabernet sauvignon",
  "merlot",
  "pinot noir",
  "syrah",
  "shiraz",
  "grenache",
  "tempranillo",
  "sangiovese",
  "nebbiolo",
  "malbec",
  "zinfandel",
  "barbera",
  "mourvedre",
  "gamay",
  "carmenere",
  "cabernet franc",
  "monastrell",
  "zweigelt",
  "agiorgitiko",
  "carignan",
  "cinsault",
  "red blend",
];

const WHITE_GRAPES = [
  "chardonnay",
  "sauvignon blanc",
  "riesling",
  "pinot grigio",
  "pinot gris",
  "chenin blanc",
  "albarino",
  "gruner veltliner",
  "viognier",
  "semillon",
  "gewurztraminer",
  "muscadet",
  "vermentino",
  "torrontes",
  "garganega",
  "arneis",
  "trebbiano",
  "fiano",
  "assyrtiko",
  "malagousia",
  "insolia",
  "glera",
  "moschofilero",
  "clairette",
  "bordeaux blanc",
  "white blend",
  "sancerre",
  "mauzac",
  "obediah",
];

function normalize(text?: string): string {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function containsAny(haystack: string, needles: string[]): string | null {
  for (const needle of needles) {
    if (haystack.includes(needle)) return needle;
  }
  return null;
}

export function classifyWine(wine: WineInput): WineClassification {
  const reasons: string[] = [];

  const grapeStr = Array.isArray(wine.grapes)
    ? wine.grapes.join(" ")
    : wine.grapes || wine.varietal || "";

  const searchable = normalize(
    [
      wine.name,
      wine.region,
      wine.style,
      wine.notes,
      wine.description,
      wine.producer,
      grapeStr,
    ]
      .filter(Boolean)
      .join(" ")
  );

  const nonAlcoholicMatch = containsAny(searchable, NON_ALCOHOLIC_KEYWORDS);
  if (nonAlcoholicMatch) {
    reasons.push(`keyword:${nonAlcoholicMatch}`);
    return { typePrimary: "nonAlcoholic", typeSecondary: [], confidence: 1, reasons };
  }

  const fortifiedMatch = containsAny(searchable, FORTIFIED_KEYWORDS);
  if (fortifiedMatch) {
    reasons.push(`keyword:${fortifiedMatch}`);
    return { typePrimary: "fortified", typeSecondary: [], confidence: 0.95, reasons };
  }

  const dessertMatch = containsAny(searchable, DESSERT_KEYWORDS);
  if (dessertMatch) {
    reasons.push(`keyword:${dessertMatch}`);
    return { typePrimary: "dessert", typeSecondary: [], confidence: 0.9, reasons };
  }

  const orangeMatch = containsAny(searchable, ORANGE_KEYWORDS);
  if (orangeMatch) {
    reasons.push(`keyword:${orangeMatch}`);
    return { typePrimary: "orange", typeSecondary: [], confidence: 0.95, reasons };
  }

  const sparklingMatch = containsAny(searchable, SPARKLING_KEYWORDS);
  if (sparklingMatch) {
    reasons.push(`keyword:${sparklingMatch}`);
    return { typePrimary: "sparkling", typeSecondary: [], confidence: 0.95, reasons };
  }

  const roseMatch = containsAny(searchable, ROSE_KEYWORDS);
  if (roseMatch) {
    reasons.push(`keyword:${roseMatch}`);
    return { typePrimary: "rose", typeSecondary: [], confidence: 0.95, reasons };
  }

  const grapeNormalized = normalize(grapeStr);
  if (grapeNormalized) {
    const redMatch = containsAny(grapeNormalized, RED_GRAPES);
    if (redMatch) {
      reasons.push(`grape:${redMatch}`);
      return { typePrimary: "red", typeSecondary: [], confidence: 0.85, reasons };
    }

    const whiteMatch = containsAny(grapeNormalized, WHITE_GRAPES);
    if (whiteMatch) {
      reasons.push(`grape:${whiteMatch}`);
      return { typePrimary: "white", typeSecondary: [], confidence: 0.85, reasons };
    }
  }

  if (searchable.includes("rouge") || searchable.includes("rosso")) {
    reasons.push("language:red");
    return { typePrimary: "red", typeSecondary: [], confidence: 0.7, reasons };
  }

  if (searchable.includes("blanc") || searchable.includes("bianco")) {
    reasons.push("language:white");
    return { typePrimary: "white", typeSecondary: [], confidence: 0.7, reasons };
  }

  if (wine.wineType) {
    const wt = normalize(wine.wineType);
    const fallbackMap: Record<string, WineTypeKey> = {
      red: "red", white: "white", rose: "rose",
      sparkling: "sparkling", amber: "orange",
    };
    const mapped = fallbackMap[wt];
    if (mapped) {
      reasons.push(`fallback:wineType=${wine.wineType}`);
      return { typePrimary: mapped, typeSecondary: [], confidence: 0.5, reasons };
    }
  }

  return {
    typePrimary: "white",
    typeSecondary: [],
    confidence: 0.4,
    reasons: ["fallback:default_white"],
  };
}
