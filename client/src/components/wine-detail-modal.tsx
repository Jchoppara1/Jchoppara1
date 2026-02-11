import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Thermometer, Wine, UtensilsCrossed } from "lucide-react";
import { formatPrice } from "@shared/wineRules";
import { apiRequest } from "@/lib/queryClient";
import { useIsMobile } from "@/hooks/use-mobile";

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
}

const wineTypeColors: Record<string, string> = {
  Red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  White: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Rosé: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  Sparkling: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
};

const priceCategoryColors: Record<string, string> = {
  "$": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  "$$": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "$$$": "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  "$$$$": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
};

function StyleBar({ label, value }: { label: string; value: string }) {
  const levels: Record<string, number> = {
    none: 0, light: 1, low: 1, dry: 1,
    medium: 2, "medium-light": 1.5, "medium-full": 2.5, "off-dry": 1.5,
    high: 3, full: 3, heavy: 3, sweet: 3,
  };
  const level = levels[value] ?? 1;
  const pct = Math.round((level / 3) * 100);

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground w-20 shrink-0 capitalize">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-primary/70 transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground w-16 text-right capitalize">{value}</span>
    </div>
  );
}

function WineDetailContent({ wine, isGlassWine }: { wine: EnrichedWine; isGlassWine: boolean }) {
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

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-1.5">
        <Badge className={`text-xs ${wineTypeColors[wine.wineType]}`} data-testid="badge-wine-detail-type">
          {wine.wineType}
        </Badge>
        <Badge className={`text-xs ${priceCategoryColors[wine.priceCategory]}`}>
          {wine.priceCategory}
        </Badge>
        <Badge variant="outline" className="text-xs font-semibold" data-testid="badge-wine-detail-price">
          {formatPrice(wine.priceCents)}
        </Badge>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm">
          <Wine className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="text-muted-foreground">Grape:</span>
          <span className="font-medium">{wine.varietal}</span>
        </div>
        {profile?.regionCues && profile.regionCues.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            <span className="text-muted-foreground">Region:</span>
            <span className="font-medium">{profile.regionCues.join(", ")}</span>
          </div>
        )}
      </div>

      {profile && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Style Breakdown</h4>
          <div className="space-y-2">
            <StyleBar label="Body" value={profile.body} />
            <StyleBar label="Acidity" value={profile.acidity} />
            {profile.tannin !== "none" && <StyleBar label="Tannin" value={profile.tannin} />}
            <StyleBar label="Sweetness" value={profile.sweetness} />
            {profile.oak !== "none" && <StyleBar label="Oak" value={profile.oak} />}
          </div>
        </div>
      )}

      {desc && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Tasting Notes</h4>
          <div className="space-y-2">
            <div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Aroma</span>
              <ul className="mt-1 space-y-0.5">
                {desc.aromas.map((a, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-1.5 shrink-0">
                      <svg width="6" height="6"><circle cx="3" cy="3" r="3" fill="currentColor"/></svg>
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Palate</span>
              <ul className="mt-1 space-y-0.5">
                {desc.palate.map((p, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-primary mt-1.5 shrink-0">
                      <svg width="6" height="6"><circle cx="3" cy="3" r="3" fill="currentColor"/></svg>
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
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Flavor Notes</h4>
          <div className="flex flex-wrap gap-1.5">
            {profile.flavorNotes.map((note) => (
              <Badge key={note} variant="outline" className="text-xs capitalize">
                {note}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {topPairings.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
            <UtensilsCrossed className="h-3.5 w-3.5" />
            Best Food Matches
          </h4>
          <div className="space-y-2">
            {topPairings.map(({ food, score, explanation }) => (
              <div key={food.id} className="flex items-start gap-3 text-sm" data-testid={`wine-detail-pairing-${food.id}`}>
                <span className="font-semibold tabular-nums text-primary shrink-0">{Math.round(score * 100)}%</span>
                <div className="min-w-0">
                  <span className="font-medium">{food.name.replace(" (GF)", "")}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-sm border-t pt-4">
        <Thermometer className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-muted-foreground">Serve at</span>
        <span className="font-medium" data-testid="text-wine-detail-temp">{servingTemp}</span>
      </div>

      {desc && desc.servingSuggestions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Serving Suggestions</h4>
          <ul className="space-y-1">
            {desc.servingSuggestions.map((s, i) => (
              <li key={i} className="text-sm text-muted-foreground">{s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function WineDetailModal({ wine, open, onOpenChange, isGlassWine = false }: WineDetailModalProps) {
  const isMobile = useIsMobile();

  if (!wine) return null;

  const desc = wine.wineDescription;
  const title = wine.name;
  const subtitle = desc?.headline;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]" data-testid="wine-detail-modal">
          <div className="overflow-y-auto px-6 pb-6">
            <DrawerHeader className="px-0 pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <DrawerTitle className="text-xl font-bold leading-tight break-words" data-testid="text-wine-detail-name">
                    {title}
                  </DrawerTitle>
                  {subtitle && (
                    <p className="text-sm text-muted-foreground italic mt-1">{subtitle}</p>
                  )}
                </div>
                <DrawerClose asChild>
                  <Button size="icon" variant="ghost" data-testid="button-close-wine-detail">
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerHeader>
            <WineDetailContent wine={wine} isGlassWine={isGlassWine} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg max-h-[85vh] overflow-y-auto p-0"
        data-testid="wine-detail-modal"
      >
        <div className="p-6 space-y-5">
          <DialogHeader className="space-y-2 pr-8">
            <DialogTitle className="text-xl font-bold leading-tight break-words" data-testid="text-wine-detail-name">
              {title}
            </DialogTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground italic">{subtitle}</p>
            )}
          </DialogHeader>
          <WineDetailContent wine={wine} isGlassWine={isGlassWine} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
