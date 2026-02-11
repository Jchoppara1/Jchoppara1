import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { FoodCard } from "@/components/food-card";
import { DishDetailModal } from "@/components/dish-detail-modal";
import { Search } from "lucide-react";
import type { Food, FoodCategory } from "@shared/foodSchema";

const foodCategories: FoodCategory[] = ["Mazzes", "Spreads", "Greens & Grains", "Meats & Seafood"];

export default function FoodMenu() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<FoodCategory | "all">("all");
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  const { data: foods, isLoading } = useQuery<Food[]>({
    queryKey: ["/api/foods"],
  });

  const filteredFoods = foods?.filter((food) => {
    const matchesSearch = !search || 
      food.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || food.category === category;
    return matchesSearch && matchesCategory;
  }) || [];

  const groupedFoods = foodCategories.reduce((acc, cat) => {
    acc[cat] = filteredFoods.filter(f => f.category === cat);
    return acc;
  }, {} as Record<FoodCategory, Food[]>);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold" data-testid="text-food-menu-title">Food Menu</h1>
        <p className="text-muted-foreground">Browse our dishes and discover perfect wine pairings</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            data-testid="input-food-search"
          />
        </div>
        <Select 
          value={category} 
          onValueChange={(v) => setCategory(v as FoodCategory | "all")}
        >
          <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-food-category">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {foodCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {foodCategories.map((cat) => {
            const items = groupedFoods[cat];
            if (category !== "all" && category !== cat) return null;
            if (items.length === 0) return null;
            
            return (
              <section key={cat}>
                <h2 
                  className="text-xl font-semibold mb-4 border-b pb-2"
                  data-testid={`text-category-${cat.replace(/\s+/g, "-").toLowerCase()}`}
                >
                  {cat}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((food) => (
                    <FoodCard key={food.id} food={food} onClick={setSelectedFood} />
                  ))}
                </div>
              </section>
            );
          })}
          
          {filteredFoods.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No dishes found matching your criteria.</p>
            </div>
          )}
        </div>
      )}

      <DishDetailModal
        food={selectedFood}
        open={!!selectedFood}
        onOpenChange={(open) => !open && setSelectedFood(null)}
      />
    </div>
  );
}
