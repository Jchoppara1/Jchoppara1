import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Food } from "@shared/foodSchema";
import { Link } from "wouter";

interface FoodCardProps {
  food: Food;
}

const categoryColors: Record<string, string> = {
  "Mazzes": "bg-amber-500/20 text-amber-700 dark:text-amber-300",
  "Spreads": "bg-green-500/20 text-green-700 dark:text-green-300",
  "Greens & Grains": "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
  "Meats & Seafood": "bg-rose-500/20 text-rose-700 dark:text-rose-300",
};

export function FoodCard({ food }: FoodCardProps) {
  const priceDisplay = `$${(food.priceCents / 100).toFixed(0)}`;
  
  return (
    <Link href={`/food/${food.id}`}>
      <Card 
        className="hover-elevate cursor-pointer h-full"
        data-testid={`card-food-${food.id}`}
      >
        <CardContent className="p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <h3 
                className="font-semibold text-lg leading-tight"
                data-testid={`text-food-name-${food.id}`}
              >
                {food.name}
              </h3>
              <span 
                className="font-bold text-lg shrink-0"
                data-testid={`text-food-price-${food.id}`}
              >
                {priceDisplay}
              </span>
            </div>
            
            <Badge 
              className={`w-fit ${categoryColors[food.category] || "bg-muted"}`}
              data-testid={`badge-food-category-${food.id}`}
            >
              {food.category}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
