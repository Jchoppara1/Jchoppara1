import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import type { Wine } from "@shared/schema";
import type { Food } from "@shared/foodSchema";
import { getFoodPairingsForWine } from "@shared/pairingRules";
import { UtensilsCrossed } from "lucide-react";

interface WineFoodPairingsProps {
  wine: Wine;
  maxItems?: number;
}

export function WineFoodPairings({ wine, maxItems = 3 }: WineFoodPairingsProps) {
  const { data: foods } = useQuery<Food[]>({
    queryKey: ["/api/foods"],
  });

  if (!foods || foods.length === 0) return null;

  const pairings = getFoodPairingsForWine(wine, foods);
  if (pairings.length === 0) return null;

  const displayedPairings = pairings.slice(0, maxItems);
  const remainingCount = pairings.length - maxItems;

  return (
    <div className="pt-2 border-t mt-2">
      <div className="flex items-center gap-1.5 mb-1.5">
        <UtensilsCrossed className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground font-medium">Pairs With</span>
      </div>
      <div className="flex flex-wrap gap-1">
        {displayedPairings.map(({ food }) => (
          <Link key={food.id} href={`/food/${food.id}`}>
            <Badge 
              variant="outline" 
              className="text-xs cursor-pointer hover-elevate"
              data-testid={`badge-food-pair-${wine.id}-${food.id}`}
            >
              {food.name.replace(" (GF)", "")}
            </Badge>
          </Link>
        ))}
        {remainingCount > 0 && (
          <Badge variant="outline" className="text-xs">
            +{remainingCount}
          </Badge>
        )}
      </div>
    </div>
  );
}
