import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Wine, Check, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Food } from "@shared/foodSchema";

interface PairingResult {
  wine: {
    id: string;
    name: string;
    wineType: string;
    varietal: string;
    priceCents: number;
    priceCategory: string;
  };
  score: number;
  explanation: string;
  whyItWorks: string[];
}

interface DishDetailModalProps {
  food: Food | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoryColors: Record<string, string> = {
  "Mazzes": "bg-amber-500/20 text-amber-700 dark:text-amber-300",
  "Spreads": "bg-green-500/20 text-green-700 dark:text-green-300",
  "Greens & Grains": "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
  "Meats & Seafood": "bg-rose-500/20 text-rose-700 dark:text-rose-300",
};

const wineTypeColors: Record<string, string> = {
  Red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  White: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Rosé: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  Sparkling: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
};

function inferAttributes(food: Food) {
  const name = food.name.toLowerCase();
  const desc = (food.description || "").toLowerCase();
  const combined = name + " " + desc;
  const cat = food.category;

  let protein = "Vegetable";
  if (cat === "Meats & Seafood") {
    if (combined.includes("lamb") || combined.includes("kofta") || combined.includes("adana")) protein = "Lamb";
    else if (combined.includes("chicken") || combined.includes("shawarma")) protein = "Chicken";
    else if (combined.includes("shrimp") || combined.includes("fish") || combined.includes("seafood") || combined.includes("calamari") || combined.includes("prawns")) protein = "Seafood";
    else if (combined.includes("beef") || combined.includes("steak")) protein = "Beef";
    else protein = "Meat";
  } else if (combined.includes("cheese") || combined.includes("halloumi") || combined.includes("feta")) {
    protein = "Cheese";
  }

  let spiceLevel = "Mild";
  if (combined.includes("spic") || combined.includes("harissa") || combined.includes("chili") || combined.includes("adana") || combined.includes("hot")) spiceLevel = "Spicy";
  else if (combined.includes("cumin") || combined.includes("sumac") || combined.includes("za'atar") || combined.includes("herbs")) spiceLevel = "Medium";

  let sauce = "None";
  if (combined.includes("tahini")) sauce = "Tahini";
  else if (combined.includes("yogurt") || combined.includes("labneh")) sauce = "Yogurt";
  else if (combined.includes("tomato") || combined.includes("pomegranate")) sauce = "Tomato-based";
  else if (combined.includes("olive oil") || combined.includes("lemon")) sauce = "Olive oil & lemon";

  let richness = "Light";
  if (cat === "Meats & Seafood" || combined.includes("cream") || combined.includes("cheese") || combined.includes("butter")) richness = "Rich";
  else if (cat === "Spreads" || combined.includes("olive oil") || combined.includes("tahini")) richness = "Medium";

  return { protein, spiceLevel, sauce, richness };
}

function DishDetailContent({ food }: { food: Food }) {
  const { data: glassPairings, isLoading: glassLoading } = useQuery<PairingResult[]>({
    queryKey: ["/api/foods", food.id, "pairings", "glass", "classic", "detail"],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/foods/${food.id}/pairings?list=glass&mode=classic`);
      return res.json();
    },
  });

  const { data: bottlePairings, isLoading: bottleLoading } = useQuery<PairingResult[]>({
    queryKey: ["/api/foods", food.id, "pairings", "bottle", "classic", "detail"],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/foods/${food.id}/pairings?list=bottle&mode=classic`);
      return res.json();
    },
  });

  const attrs = inferAttributes(food);
  const isLoadingPairings = glassLoading || bottleLoading;

  const allPairings = [
    ...(glassPairings || []).map(p => ({ ...p, listLabel: "Glass" })),
    ...(bottlePairings || []).map(p => ({ ...p, listLabel: "Bottle" })),
  ].sort((a, b) => b.score - a.score).slice(0, 3);

  return (
    <div className="space-y-5">
      {food.description && (
        <p className="text-sm text-muted-foreground" data-testid="text-dish-detail-description">
          {food.description}
        </p>
      )}

      <div className="space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Dish Attributes</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground">Protein</span>
            <p className="text-sm font-medium" data-testid="text-dish-attr-protein">{attrs.protein}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground">Spice Level</span>
            <p className="text-sm font-medium" data-testid="text-dish-attr-spice">{attrs.spiceLevel}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground">Sauce</span>
            <p className="text-sm font-medium" data-testid="text-dish-attr-sauce">{attrs.sauce}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-muted-foreground">Richness</span>
            <p className="text-sm font-medium" data-testid="text-dish-attr-richness">{attrs.richness}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
          <Wine className="h-3.5 w-3.5" />
          Top Wine Pairings
        </h4>

        {isLoadingPairings ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : allPairings.length > 0 ? (
          <div className="space-y-3">
            {allPairings.map(({ wine, score, explanation, whyItWorks, listLabel }) => (
              <div
                key={wine.id}
                className="border rounded-md p-3 space-y-2"
                data-testid={`dish-detail-pairing-${wine.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-sm break-words">{wine.name}</span>
                      <Badge className={`text-xs ${wineTypeColors[wine.wineType]}`}>
                        {wine.wineType}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {listLabel}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{wine.varietal}</p>
                  </div>
                  <span className="text-lg font-bold tabular-nums text-primary shrink-0">
                    {Math.round(score * 100)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{explanation}</p>
                {whyItWorks.length > 0 && (
                  <div className="space-y-0.5">
                    {whyItWorks.slice(0, 2).map((reason, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs">
                        <Check className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{reason}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No wine pairings available.</p>
        )}
      </div>
    </div>
  );
}

export function DishDetailModal({ food, open, onOpenChange }: DishDetailModalProps) {
  const isMobile = useIsMobile();

  if (!food) return null;

  const priceDisplay = `$${(food.priceCents / 100).toFixed(0)}`;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]" data-testid="dish-detail-modal">
          <div className="overflow-y-auto px-6 pb-6">
            <DrawerHeader className="px-0 pb-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <DrawerTitle className="text-xl font-bold leading-tight break-words" data-testid="text-dish-detail-name">
                    {food.name}
                  </DrawerTitle>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xl font-bold" data-testid="text-dish-detail-price">{priceDisplay}</span>
                  <DrawerClose asChild>
                    <Button size="icon" variant="ghost" data-testid="button-close-dish-detail">
                      <X className="h-4 w-4" />
                    </Button>
                  </DrawerClose>
                </div>
              </div>
            </DrawerHeader>
            <Badge className={`mb-4 ${categoryColors[food.category] || "bg-muted"}`} data-testid="badge-dish-detail-category">
              {food.category}
            </Badge>
            <DishDetailContent food={food} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg max-h-[85vh] overflow-y-auto p-0"
        data-testid="dish-detail-modal"
      >
        <div className="p-6 space-y-5">
          <DialogHeader className="space-y-2 pr-8">
            <div className="flex items-start justify-between gap-3">
              <DialogTitle className="text-xl font-bold leading-tight break-words" data-testid="text-dish-detail-name">
                {food.name}
              </DialogTitle>
              <span className="text-xl font-bold shrink-0" data-testid="text-dish-detail-price">
                {priceDisplay}
              </span>
            </div>
          </DialogHeader>
          <Badge className={`${categoryColors[food.category] || "bg-muted"}`} data-testid="badge-dish-detail-category">
            {food.category}
          </Badge>
          <DishDetailContent food={food} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
