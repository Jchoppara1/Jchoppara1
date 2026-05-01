import { describe, it, expect } from "vitest";
import { classifyWine, WineInput, WineClassification } from "@shared/wineTypes";

function classify(partial: Partial<WineInput>): WineClassification {
  return classifyWine({ name: "", ...partial });
}

describe("classifyWine", () => {
  describe("Sparkling", () => {
    it("classifies Champagne region as sparkling", () => {
      const result = classify({ name: "Dom Perignon", region: "Champagne" });
      expect(result.typePrimary).toBe("sparkling");
      expect(result.confidence).toBeGreaterThanOrEqual(0.95);
    });

    it("classifies Champagne Chardonnay as sparkling (region overrides grape)", () => {
      const result = classify({ name: "Blanc de Blancs", region: "Champagne", grapes: ["Chardonnay"] });
      expect(result.typePrimary).toBe("sparkling");
    });

    it("Billecart-Salmon Brut Rosé Champagne => sparkling primary, rose secondary, high confidence", () => {
      const result = classify({ name: "Billecart-Salmon Brut Rosé", region: "Champagne" });
      expect(result.typePrimary).toBe("sparkling");
      expect(result.typeSecondary).toContain("rose");
      expect(result.confidence).toBeGreaterThanOrEqual(0.95);
    });

    it("classifies Prosecco as sparkling", () => {
      const result = classify({ name: "La Marca Prosecco" });
      expect(result.typePrimary).toBe("sparkling");
    });

    it("classifies Cava as sparkling", () => {
      const result = classify({ name: "Freixenet Cava Brut" });
      expect(result.typePrimary).toBe("sparkling");
    });

    it("classifies Franciacorta as sparkling", () => {
      const result = classify({ name: "Berlucchi Franciacorta" });
      expect(result.typePrimary).toBe("sparkling");
    });

    it("classifies Crémant as sparkling", () => {
      const result = classify({ name: "Crémant d'Alsace" });
      expect(result.typePrimary).toBe("sparkling");
    });
  });

  describe("Brut handling", () => {
    it("does NOT classify 'Brut' alone as sparkling", () => {
      const result = classify({ name: "Some Wine Brut", grapes: ["Chardonnay"] });
      expect(result.typePrimary).not.toBe("sparkling");
    });

    it("classifies Brut Champagne as sparkling (keyword present)", () => {
      const result = classify({ name: "Brut Reserve", region: "Champagne" });
      expect(result.typePrimary).toBe("sparkling");
    });
  });

  describe("Dual classification (typeSecondary)", () => {
    it("Moscato d'Asti => sparkling primary + dessert secondary", () => {
      const result = classify({ name: "Moscato d'Asti", region: "Asti" });
      expect(result.typePrimary).toBe("sparkling");
      expect(result.typeSecondary).toContain("dessert");
    });

    it("Demi-sec Champagne => sparkling primary + dessert secondary", () => {
      const result = classify({ name: "Demi-Sec", region: "Champagne" });
      expect(result.typePrimary).toBe("sparkling");
      expect(result.typeSecondary).toContain("dessert");
    });

    it("Port with sweet descriptor => fortified primary + dessert secondary", () => {
      const result = classify({ name: "Late Bottled Vintage Port", notes: "sweet" });
      expect(result.typePrimary).toBe("fortified");
      expect(result.typeSecondary).toContain("dessert");
    });
  });

  describe("Fortified", () => {
    it("classifies Port as fortified", () => {
      const result = classify({ name: "Taylor's Late Bottled Vintage Port" });
      expect(result.typePrimary).toBe("fortified");
      expect(result.confidence).toBeGreaterThanOrEqual(0.9);
    });

    it("classifies Sherry as fortified", () => {
      const result = classify({ name: "Tio Pepe Fino Sherry" });
      expect(result.typePrimary).toBe("fortified");
    });

    it("classifies Madeira as fortified", () => {
      const result = classify({ name: "Blandy's 10 Year Old Madeira" });
      expect(result.typePrimary).toBe("fortified");
    });

    it("classifies Marsala as fortified", () => {
      const result = classify({ name: "Florio Marsala Superiore" });
      expect(result.typePrimary).toBe("fortified");
    });

    it("classifies Jerez region as fortified", () => {
      const result = classify({ name: "Fino", region: "Jerez" });
      expect(result.typePrimary).toBe("fortified");
    });
  });

  describe("Dessert", () => {
    it("classifies Sauternes as dessert", () => {
      const result = classify({ name: "Château d'Yquem Sauternes" });
      expect(result.typePrimary).toBe("dessert");
    });

    it("classifies Tokaji as dessert", () => {
      const result = classify({ name: "Tokaji Aszú 5 Puttonyos" });
      expect(result.typePrimary).toBe("dessert");
    });

    it("classifies late harvest as dessert", () => {
      const result = classify({ name: "Late Harvest Riesling" });
      expect(result.typePrimary).toBe("dessert");
    });

    it("classifies Sauternes region as dessert", () => {
      const result = classify({ name: "Château Something", region: "Sauternes" });
      expect(result.typePrimary).toBe("dessert");
    });
  });

  describe("Orange / Skin-contact", () => {
    it("classifies skin-contact as orange", () => {
      const result = classify({ name: "Skin-contact Pinot Grigio" });
      expect(result.typePrimary).toBe("orange");
    });

    it("classifies ramato as orange", () => {
      const result = classify({ name: "Ramato Pinot Grigio" });
      expect(result.typePrimary).toBe("orange");
    });
  });

  describe("Rosé", () => {
    it("classifies Rosé as rose", () => {
      const result = classify({ name: "Whispering Angel Rosé" });
      expect(result.typePrimary).toBe("rose");
    });

    it("classifies Rose (no accent) as rose", () => {
      const result = classify({ name: "Provence Rose" });
      expect(result.typePrimary).toBe("rose");
    });
  });

  describe("Non-alcoholic", () => {
    it("classifies non-alcoholic wines", () => {
      const result = classify({ name: "Fre Non-Alcoholic Chardonnay" });
      expect(result.typePrimary).toBe("nonAlcoholic");
      expect(result.confidence).toBe(1);
    });

    it("classifies dealcoholized wines", () => {
      const result = classify({ name: "Dealcoholized Merlot" });
      expect(result.typePrimary).toBe("nonAlcoholic");
    });
  });

  describe("Grape-based classification", () => {
    it("classifies red grape varietals as red", () => {
      const result = classify({ name: "Reserve", grapes: ["Cabernet Sauvignon"] });
      expect(result.typePrimary).toBe("red");
      expect(result.confidence).toBeGreaterThanOrEqual(0.85);
    });

    it("classifies white grape varietals as white", () => {
      const result = classify({ name: "Estate", grapes: ["Sauvignon Blanc"] });
      expect(result.typePrimary).toBe("white");
      expect(result.confidence).toBeGreaterThanOrEqual(0.85);
    });

    it("classifies Pinot Noir as red", () => {
      const result = classify({ name: "Oregon", varietal: "Pinot Noir" });
      expect(result.typePrimary).toBe("red");
    });

    it("classifies Riesling as white", () => {
      const result = classify({ name: "Mosel", varietal: "Riesling" });
      expect(result.typePrimary).toBe("white");
    });

    it("handles mixed red/white grapes with lower confidence", () => {
      const result = classify({ name: "Field Blend", grapes: ["Cabernet Sauvignon", "Chardonnay"] });
      expect(result.confidence).toBeLessThanOrEqual(0.70);
    });
  });

  describe("Language hints", () => {
    it("classifies rouge as red", () => {
      const result = classify({ name: "Côtes du Rhône Rouge" });
      expect(result.typePrimary).toBe("red");
      expect(result.confidence).toBeGreaterThanOrEqual(0.65);
    });

    it("classifies blanc as white", () => {
      const result = classify({ name: "Bordeaux Blanc" });
      expect(result.typePrimary).toBe("white");
    });

    it("classifies rosso as red", () => {
      const result = classify({ name: "Rosso di Montalcino" });
      expect(result.typePrimary).toBe("red");
    });

    it("classifies bianco as white", () => {
      const result = classify({ name: "Verdicchio Bianco" });
      expect(result.typePrimary).toBe("white");
    });
  });

  describe("Fallback", () => {
    it("uses wineType field as fallback", () => {
      const result = classify({ name: "Mystery Wine", wineType: "red" });
      expect(result.typePrimary).toBe("red");
      expect(result.confidence).toBeLessThanOrEqual(0.55);
    });

    it("defaults to white with low confidence when no info", () => {
      const result = classify({ name: "Unknown Wine" });
      expect(result.typePrimary).toBe("white");
      expect(result.confidence).toBeLessThanOrEqual(0.45);
      expect(result.reasons).toContain("fallback:default_white");
    });
  });

  describe("Confidence tiers", () => {
    it("definitive keywords get 0.98+", () => {
      const champagne = classify({ name: "Champagne Brut" });
      expect(champagne.confidence).toBeGreaterThanOrEqual(0.98);

      const port = classify({ name: "Vintage Port" });
      expect(port.confidence).toBeGreaterThanOrEqual(0.98);

      const na = classify({ name: "Non-Alcoholic Wine" });
      expect(na.confidence).toBe(1);
    });

    it("grape inference gets 0.85-0.92", () => {
      const result = classify({ name: "Reserve", grapes: ["Merlot"] });
      expect(result.confidence).toBeGreaterThanOrEqual(0.85);
      expect(result.confidence).toBeLessThanOrEqual(0.92);
    });

    it("language hints get 0.65-0.75", () => {
      const result = classify({ name: "Bordeaux Rouge" });
      expect(result.confidence).toBeGreaterThanOrEqual(0.65);
      expect(result.confidence).toBeLessThanOrEqual(0.75);
    });

    it("fallback default gets 0.40-0.55", () => {
      const result = classify({ name: "Unknown" });
      expect(result.confidence).toBeGreaterThanOrEqual(0.40);
      expect(result.confidence).toBeLessThanOrEqual(0.55);
    });
  });

  describe("Filter integration (typeSecondary matching)", () => {
    it("a wine with sparkling primary + dessert secondary should match dessert filter", () => {
      const wine = classify({ name: "Moscato d'Asti", region: "Asti" });
      const selectedType = "dessert";
      const matches = wine.typePrimary === selectedType || wine.typeSecondary.includes(selectedType);
      expect(matches).toBe(true);
    });

    it("a wine with sparkling primary + rose secondary should match rose filter", () => {
      const wine = classify({ name: "Billecart-Salmon Rosé", region: "Champagne" });
      const selectedType = "rose";
      const matches = wine.typePrimary === selectedType || wine.typeSecondary.includes(selectedType);
      expect(matches).toBe(true);
    });

    it("a wine with fortified primary + dessert secondary should match both filters", () => {
      const wine = classify({ name: "Sweet Port", notes: "sweet" });
      expect(wine.typePrimary === "fortified" || wine.typeSecondary.includes("fortified" as any)).toBe(true);
      expect(wine.typePrimary === "dessert" || wine.typeSecondary.includes("dessert" as any)).toBe(true);
    });
  });
});
