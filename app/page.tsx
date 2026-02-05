import Link from "next/link";
import { Wine, Utensils, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <Wine className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Wine Pairing Wizard
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get expert wine pairing recommendations powered by sommelier knowledge and AI-enhanced suggestions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link
            href="/wizard/dish"
            className="group relative overflow-hidden rounded-xl border bg-card p-8 hover:shadow-lg transition-all duration-300"
            data-testid="link-dish-mode"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-100 to-transparent rounded-bl-full opacity-50" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-orange-100 mb-4">
                <Utensils className="w-7 h-7 text-orange-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">I have a dish</h2>
              <p className="text-muted-foreground mb-4">
                Tell us about your dish and we'll recommend the perfect wines to complement it
              </p>
              <div className="flex items-center text-primary font-medium">
                Find wine pairings
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          <Link
            href="/wizard/wine"
            className="group relative overflow-hidden rounded-xl border bg-card p-8 hover:shadow-lg transition-all duration-300"
            data-testid="link-wine-mode"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100 to-transparent rounded-bl-full opacity-50" />
            <div className="relative">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-purple-100 mb-4">
                <Wine className="w-7 h-7 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">I have a wine</h2>
              <p className="text-muted-foreground mb-4">
                Tell us about your wine and we'll suggest dishes that pair beautifully
              </p>
              <div className="flex items-center text-primary font-medium">
                Find food pairings
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
            <Sparkles className="w-4 h-4" />
            Powered by expert sommelier sources and curated pairing rules
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-muted-foreground max-w-xl mx-auto">
          <p>
            Suggestions are educational. Please verify with a professional for allergies or medical concerns.
          </p>
        </div>
      </div>
    </main>
  );
}
