import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Home from "@/pages/home";
import FoodMenu from "@/pages/food-menu";
import FoodDetail from "@/pages/food-detail";
import AdminPage from "@/pages/admin";
import DeckPage from "@/pages/deck";
import NotFound from "@/pages/not-found";
import { Grape, UtensilsCrossed } from "lucide-react";

function NavBar() {
  const [location] = useLocation();
  
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-delbar-pattern">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="font-serif text-lg font-semibold tracking-wide text-foreground select-none">Delbar</span>
          <div className="w-px h-6 bg-border" />
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
              Pairings
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
      <Route path="/admin" component={AdminPage} />
      <Route path="/deck" component={DeckPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const hideNav = location === "/deck";

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {!hideNav && <NavBar />}
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
