import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Wine } from "lucide-react";
import type { Food } from "@shared/foodSchema";
import type { Wine as WineType } from "@shared/schema";
import { getWinePairingsForFood } from "@shared/pairingRules";

const categoryColors: Record<string, string> = {
  "Mazzes": "bg-amber-500/20 text-amber-700 dark:text-amber-300",
  "Spreads": "bg-green-500/20 text-green-700 dark:text-green-300",
  "Greens & Grains": "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
  "Meats & Seafood": "bg-rose-500/20 text-rose-700 dark:text-rose-300",
};

const wineTypeColors: Record<string, string> = {
  Red: "bg-red-500/20 text-red-700 dark:text-red-300",
  White: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300",
  Rosé: "bg-pink-500/20 text-pink-700 dark:text-pink-300",
  Sparkling: "bg-sky-500/20 text-sky-700 dark:text-sky-300",
};

const priceCategoryColors: Record<string, string> = {
  "$": "bg-green-500/20 text-green-700 dark:text-green-300",
  "$$": "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  "$$$": "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  "$$$$": "bg-amber-500/20 text-amber-700 dark:text-amber-300",
};

export default function FoodDetail() {
  const [, params] = useRoute("/food/:id");
  const foodId = params?.id;

  const { data: food, isLoading: foodLoading } = useQuery<Food>({
    queryKey: ["/api/foods", foodId],
    enabled: !!foodId,
  });

  const { data: bottleWines, isLoading: bottleWinesLoading } = useQuery<WineType[]>({
    queryKey: ["/api/wines"],
  });

  const { data: glassWines, isLoading: glassWinesLoading } = useQuery<WineType[]>({
    queryKey: ["/api/wines-by-glass"],
  });

  const isLoading = foodLoading || bottleWinesLoading || glassWinesLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!food) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Dish not found</p>
          <Link href="/food">
            <Button variant="ghost">Back to Food Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  const bottlePairings = bottleWines ? getWinePairingsForFood(food, bottleWines) : [];
  const glassPairings = glassWines ? getWinePairingsForFood(food, glassWines) : [];
  const priceDisplay = `$${(food.priceCents / 100).toFixed(0)}`;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Link href="/food">
        <Button variant="ghost" size="sm" data-testid="button-back-to-menu">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Menu
        </Button>
      </Link>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-3">
              <h1 
                className="text-3xl font-bold"
                data-testid="text-food-detail-name"
              >
                {food.name}
              </h1>
              <Badge 
                className={`${categoryColors[food.category] || "bg-muted"}`}
                data-testid="badge-food-detail-category"
              >
                {food.category}
              </Badge>
            </div>
            <div 
              className="text-3xl font-bold"
              data-testid="text-food-detail-price"
            >
              {priceDisplay}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Wine className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Recommended Wine Pairings</h2>
        </div>

        {(bottlePairings.length > 0 || glassPairings.length > 0) ? (
          <div className="space-y-6">
            {glassPairings.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">By the Glass</h3>
                <div className="grid gap-3">
                  {glassPairings.slice(0, 3).map(({ wine, note }) => (
                    <Link key={wine.id} href="/?view=glass">
                      <Card 
                        className="hover-elevate cursor-pointer"
                        data-testid={`card-glass-pairing-${wine.id}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 
                                  className="font-semibold"
                                  data-testid={`text-glass-pairing-name-${wine.id}`}
                                >
                                  {wine.name}
                                </h3>
                                <Badge 
                                  className={wineTypeColors[wine.wineType]}
                                  data-testid={`badge-glass-type-${wine.id}`}
                                >
                                  {wine.wineType}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Glass
                                </Badge>
                              </div>
                              <p 
                                className="text-sm text-muted-foreground"
                                data-testid={`text-glass-note-${wine.id}`}
                              >
                                {note}
                              </p>
                            </div>
                            <div 
                              className="text-lg font-semibold shrink-0"
                              data-testid={`text-glass-price-${wine.id}`}
                            >
                              ${(wine.priceCents / 100).toFixed(0)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {bottlePairings.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">By the Bottle</h3>
                <div className="grid gap-3">
                  {bottlePairings.slice(0, 3).map(({ wine, note }) => (
                    <Link key={wine.id} href="/?view=bottle">
                      <Card 
                        className="hover-elevate cursor-pointer"
                        data-testid={`card-bottle-pairing-${wine.id}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 
                                  className="font-semibold"
                                  data-testid={`text-bottle-pairing-name-${wine.id}`}
                                >
                                  {wine.name}
                                </h3>
                                <Badge 
                                  className={wineTypeColors[wine.wineType]}
                                  data-testid={`badge-bottle-type-${wine.id}`}
                                >
                                  {wine.wineType}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Bottle
                                </Badge>
                              </div>
                              <p 
                                className="text-sm text-muted-foreground"
                                data-testid={`text-bottle-note-${wine.id}`}
                              >
                                {note}
                              </p>
                            </div>
                            <div 
                              className="text-lg font-semibold shrink-0"
                              data-testid={`text-bottle-price-${wine.id}`}
                            >
                              ${(wine.priceCents / 100).toFixed(0)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <p>No wine pairings available for this dish.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
