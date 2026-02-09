import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Home from "@/pages/home";
import FoodMenu from "@/pages/food-menu";
import FoodDetail from "@/pages/food-detail";
import NotFound from "@/pages/not-found";
import { Grape, UtensilsCrossed } from "lucide-react";

function NavBar() {
  const [location] = useLocation();
  
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button 
              variant={location === "/" ? "default" : "ghost"} 
              size="sm"
              className="gap-2"
              data-testid="nav-wines"
            >
              <Grape className="h-4 w-4" />
              Wines
            </Button>
          </Link>
          <Link href="/food">
            <Button 
              variant={location.startsWith("/food") ? "default" : "ghost"} 
              size="sm"
              className="gap-2"
              data-testid="nav-food"
            >
              <UtensilsCrossed className="h-4 w-4" />
              Food Menu
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/food" component={FoodMenu} />
      <Route path="/food/:id" component={FoodDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NavBar />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
