import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { X, Thermometer, Wine, UtensilsCrossed, ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";
import { formatPrice } from "@shared/wineRules";
import { apiRequest } from "@/lib/queryClient";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

interface WineProfile {
  body: string;
  acidity: string;
  tannin: string;
  sweetness: string;
  oak: string;
  flavorNotes: string[];
  regionCues?: string[];
  grapes?: string[];
}

interface WineDescription {
  headline: string;
  aromas: [string, string, string];
  palate: [string, string, string];
  servingSuggestions: string[];
}

interface EnrichedWine {
  id: string;
  name: string;
  wineType: string;
  varietal: string;
  priceCents: number;
  priceCategory: string;
  description?: string | null;
  foodPairings: string[];
  profile?: WineProfile;
  wineDescription?: WineDescription;
}

interface FoodPairingResult {
  food: { id: string; name: string; category: string; priceCents: number };
  score: number;
  explanation: string;
  whyItWorks: string[];
}

interface WineDetailModalProps {
  wine: EnrichedWine | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isGlassWine?: boolean;
  onSelectFood?: (foodId: string) => void;
  backLabel?: string;
  onBack?: () => void;
}

const wineTypeColors: Record<string, string> = {
  Red: "bg-accent text-accent-foreground",
  White: "bg-secondary text-secondary-foreground",
  "Rosé": "bg-blush/40 text-terracotta dark:bg-blush dark:text-terracotta",
  Sparkling: "bg-gold/10 text-gold dark:bg-gold/20 dark:text-gold",
};

const priceCategoryColors: Record<string, string> = {
  "$": "bg-olive/10 text-olive dark:bg-olive/20 dark:text-olive",
  "$$": "bg-secondary text-secondary-foreground",
  "$$$": "bg-gold/10 text-gold dark:bg-gold/20",
  "$$$$": "bg-gold/15 text-gold dark:bg-gold/25 border border-gold/30",
};

const categoryColors: Record<string, string> = {
  "Mazzes": "bg-gold/10 text-gold dark:bg-gold/20",
  "Spreads": "bg-olive/10 text-olive dark:bg-olive/20",
  "Greens & Grains": "bg-olive/15 text-olive dark:bg-olive/25",
  "Meats & Seafood": "bg-terracotta/10 text-terracotta dark:bg-terracotta/20",
};

function InsightChip({ label, value }: { label: string; value: string }) {
  if (!value || value === "none") return null;
  return (
    <div className="flex flex-col items-center justify-center rounded-md border px-3 py-2 min-w-[72px]" data-testid={`chip-${label.toLowerCase()}`}>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-xs font-medium capitalize mt-0.5">{value}</span>
    </div>
  );
}

function extractVintageAndClean(name: string): { displayName: string; vintage: string | null } {
  const match = name.match(/\b(19|20)\d{2}\b/);
  return { displayName: name, vintage: match ? match[0] : null };
}

function WineDetailContent({
  wine,
  isGlassWine,
  onSelectFood,
}: {
  wine: EnrichedWine;
  isGlassWine: boolean;
  onSelectFood?: (foodId: string) => void;
}) {
  const listType = isGlassWine ? "glass" : "bottle";

  const { data: pairings } = useQuery<FoodPairingResult[]>({
    queryKey: ["/api/wines", wine.id, "pairings", listType, "detail"],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/wines/${wine.id}/pairings?list=${listType}&mode=classic`);
      return res.json();
    },
  });

  const profile = wine.profile;
  const desc = wine.wineDescription;
  const topPairings = pairings?.slice(0, 5) || [];

  const servingTemp = wine.wineType === "Sparkling" ? "4-7°C (40-45°F)"
    : wine.wineType === "White" || wine.wineType === "Rosé" ? "7-10°C (45-50°F)"
    : profile?.body === "light" ? "12-14°C (54-57°F)"
    : "16-18°C (61-65°F)";

  const glassType = wine.wineType === "Sparkling" ? "Flute or coupe"
    : wine.wineType === "White" || wine.wineType === "Rosé" ? "Standard white wine glass"
    : profile?.body === "full" ? "Large Bordeaux glass"
    : "Standard red wine glass";

  const guestLikes: string[] = [];
  if (desc) {
    if (desc.aromas[0]) guestLikes.push(desc.aromas[0]);
    if (desc.palate[0]) guestLikes.push(desc.palate[0]);
  }

  return (
    <div className="space-y-5">
      {profile && (
        <div className="flex flex-wrap gap-2" data-testid="wine-insight-strip">
          <InsightChip label="Body" value={profile.body} />
          <InsightChip label="Acidity" value={profile.acidity} />
          {profile.tannin !== "none" && <InsightChip label="Tannin" value={profile.tannin} />}
          <InsightChip label="Sweetness" value={profile.sweetness} />
          {profile.oak !== "none" && <InsightChip label="Oak" value={profile.oak} />}
        </div>
      )}

      <div className="gold-divider" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-5">
          {desc && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tasting Notes</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Aroma</span>
                  <ul className="mt-1 space-y-1">
                    {desc.aromas.map((a, i) => (
                      <li key={i} className="text-sm flex items-start gap-2" data-testid={`wine-aroma-${i}`}>
                        <span className="text-primary mt-1.5 shrink-0">
                          <svg width="5" height="5"><circle cx="2.5" cy="2.5" r="2.5" fill="currentColor"/></svg>
                        </span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Palate</span>
                  <ul className="mt-1 space-y-1">
                    {desc.palate.map((p, i) => (
                      <li key={i} className="text-sm flex items-start gap-2" data-testid={`wine-palate-${i}`}>
                        <span className="text-primary mt-1.5 shrink-0">
                          <svg width="5" height="5"><circle cx="2.5" cy="2.5" r="2.5" fill="currentColor"/></svg>
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {profile && profile.flavorNotes.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Flavor Notes</h4>
              <div className="flex flex-wrap gap-1.5">
                {profile.flavorNotes.map((note) => (
                  <Badge key={note} variant="outline" className="text-xs capitalize rounded-full">
                    {note}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Serving</h4>
            <div className="flex items-center gap-2 text-sm">
              <Thermometer className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground" data-testid="text-wine-detail-temp">{servingTemp}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Wine className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="text-muted-foreground">{glassType}</span>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {topPairings.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <UtensilsCrossed className="h-3.5 w-3.5" />
                Pairs Best With
              </h4>
              <div className="space-y-2">
                {topPairings.map(({ food, score, explanation }) => (
                  <div
                    key={food.id}
                    className={`rounded-md border p-3 space-y-1 ${onSelectFood ? "cursor-pointer hover-elevate" : ""}`}
                    onClick={() => onSelectFood?.(food.id)}
                    role={onSelectFood ? "button" : undefined}
                    tabIndex={onSelectFood ? 0 : undefined}
                    onKeyDown={(e) => { if (onSelectFood && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onSelectFood(food.id); } }}
                    data-testid={`wine-detail-pairing-${food.id}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                        <span className="text-sm font-medium line-clamp-1">{food.name.replace(" (GF)", "")}</span>
                        <Badge className={`text-[10px] ${categoryColors[food.category] || "bg-muted"}`}>
                          {food.category}
                        </Badge>
                      </div>
                      <span className="text-sm font-bold tabular-nums text-primary shrink-0">{Math.round(score * 100)}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {guestLikes.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Why Guests Like It</h4>
              <ul className="space-y-1">
                {guestLikes.map((like, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2" data-testid={`wine-guest-like-${i}`}>
                    <span className="text-primary mt-1.5 shrink-0">
                      <svg width="5" height="5"><circle cx="2.5" cy="2.5" r="2.5" fill="currentColor"/></svg>
                    </span>
                    {like}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function WineDetailModal({ wine, open, onOpenChange, isGlassWine = false, onSelectFood, backLabel, onBack }: WineDetailModalProps) {
  const isMobile = useIsMobile();

  if (!wine) return null;

  const desc = wine.wineDescription;
  const profile = wine.profile;
  const { vintage } = extractVintageAndClean(wine.name);
  const regionStr = profile?.regionCues?.join(", ");
  const grapesStr = profile?.grapes?.join(", ") || wine.varietal;

  const subtitleParts: string[] = [];
  if (regionStr) subtitleParts.push(regionStr);
  if (grapesStr) subtitleParts.push(grapesStr);
  if (vintage) subtitleParts.push(vintage);

  const headerContent = (
    <>
      {backLabel && onBack && (
        <button
          className="flex items-center gap-1 text-xs text-muted-foreground mb-2 hover:text-foreground transition-colors"
          onClick={onBack}
          data-testid="button-back-to-dish"
        >
          <ArrowLeft className="h-3 w-3" />
          {backLabel}
        </button>
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          {isMobile ? (
            <DrawerTitle className="text-xl font-bold leading-tight break-words" data-testid="text-wine-detail-name">
              {wine.name}
            </DrawerTitle>
          ) : (
            <DialogTitle className="text-xl font-bold leading-tight break-words" data-testid="text-wine-detail-name">
              {wine.name}
            </DialogTitle>
          )}
          {subtitleParts.length > 0 && (
            <p className="text-sm text-muted-foreground" data-testid="text-wine-detail-subtitle">
              {subtitleParts.join(" · ")}
            </p>
          )}
          {desc?.headline && (
            <p className="text-sm text-muted-foreground italic">{desc.headline}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex flex-col items-end gap-1">
            <Badge className={`text-xs ${priceCategoryColors[wine.priceCategory]}`} data-testid="badge-wine-detail-tier">
              {wine.priceCategory}
            </Badge>
            <span className="text-sm font-semibold tabular-nums" data-testid="badge-wine-detail-price">
              {formatPrice(wine.priceCents)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-wrap mt-2">
        <Badge className={`text-xs ${wineTypeColors[wine.wineType]}`} data-testid="badge-wine-detail-type">
          {wine.wineType}
        </Badge>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]" data-testid="wine-detail-modal">
          <div className="overflow-y-auto px-6 pb-6">
            <DrawerHeader className="px-0 pb-3">
              {headerContent}
            </DrawerHeader>
            <WineDetailContent wine={wine} isGlassWine={isGlassWine} onSelectFood={onSelectFood} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[860px] max-h-[85vh] overflow-y-auto p-0 rounded-2xl"
        data-testid="wine-detail-modal"
      >
        <div className="p-7 space-y-5">
          <DialogHeader className="space-y-1 pr-8">
            {headerContent}
          </DialogHeader>
          <DialogDescription className="sr-only">Wine details and food pairing recommendations</DialogDescription>
          <WineDetailContent wine={wine} isGlassWine={isGlassWine} onSelectFood={onSelectFood} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
