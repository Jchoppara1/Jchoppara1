"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Wine, Utensils, ExternalLink, RefreshCw, Award, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface PairingResult {
  name: string;
  score: number;
  reasons: string[];
  category: string;
  varietal?: string;
  origin?: string;
}

interface EvidenceItem {
  title: string;
  url: string;
  domain: string;
  snippet: string;
  tier: string;
}

interface ResultData {
  mode: string;
  inputs: Record<string, unknown>;
  results: { pairings: PairingResult[]; evidence: EvidenceItem[] };
  confidence: number;
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId");
  const mode = searchParams.get("mode");
  
  const [data, setData] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) {
      setError("No request ID provided");
      setLoading(false);
      return;
    }

    fetch(`/api/results/${requestId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch results");
        return res.json();
      })
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [requestId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your pairings...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">{error || "No results found"}</p>
            <Link href="/">
              <Button>Start New Pairing</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pairings = data.results.pairings || [];
  const evidence = data.results.evidence || [];
  const isDishMode = data.mode === "dish";

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <Link href={isDishMode ? "/wizard/dish" : "/wizard/wine"}>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refine
            </Button>
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
            {isDishMode ? (
              <Wine className="w-7 h-7 text-primary" />
            ) : (
              <Utensils className="w-7 h-7 text-primary" />
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2">Your Perfect Pairings</h1>
          <p className="text-muted-foreground">
            {isDishMode 
              ? `Wine recommendations for "${(data.inputs as { dishName?: string }).dishName || "your dish"}"`
              : `Food recommendations for "${(data.inputs as { wineName?: string }).wineName || "your wine"}"`
            }
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="font-medium">Confidence Score</span>
              </div>
              <span className="text-2xl font-bold">{data.confidence}%</span>
            </div>
            <Progress value={data.confidence} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              Based on pairing rules {evidence.length > 0 ? `and ${evidence.length} expert sources` : ""}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Top {pairings.length} Recommendations</h2>
          </div>
          
          {pairings.map((pairing, index) => (
            <Card key={index} className={index === 0 ? "border-primary/50 shadow-md" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {index === 0 && (
                        <Badge className="bg-primary">Top Pick</Badge>
                      )}
                      <Badge variant="outline">{pairing.category}</Badge>
                    </div>
                    <CardTitle className="text-xl">{pairing.name}</CardTitle>
                    {pairing.varietal && (
                      <CardDescription>{pairing.varietal} • {pairing.origin}</CardDescription>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{pairing.score}</div>
                    <div className="text-xs text-muted-foreground">score</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Why it works:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {pairing.reasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {evidence.length > 0 && (
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Expert Sources</h2>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {evidence.map((item, index) => (
                    <div key={index} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              Tier {item.tier}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{item.domain}</span>
                          </div>
                          <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">{item.snippet}</p>
                        </div>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0"
                        >
                          <Button variant="ghost" size="icon">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium mb-1">Rule-Based Reasoning</h4>
                <p className="text-sm text-muted-foreground">
                  Our recommendations are based on established wine pairing principles including 
                  matching weight and intensity, complementing or contrasting flavors, 
                  considering acidity and tannin levels, and traditional regional pairings.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button size="lg">
              <Sparkles className="w-4 h-4 mr-2" />
              New Pairing
            </Button>
          </Link>
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

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
