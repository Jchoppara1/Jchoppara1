"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Utensils, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";

interface Wine {
  id: string;
  name: string;
  grape: string;
  category: string;
  origin: string;
}

export default function WineWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [wines, setWines] = useState<Wine[]>([]);
  
  const [formData, setFormData] = useState({
    wineName: "",
    varietal: "",
    region: "",
    sweetness: 2,
    body: 3,
    tannin: 3,
    acidity: 3,
  });

  useEffect(() => {
    fetch("/api/wines")
      .then(res => res.json())
      .then(data => setWines(data))
      .catch(console.error);
  }, []);

  const totalSteps = 2;
  const progress = (step / totalSteps) * 100;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "wine",
          inputs: formData,
        }),
      });
      
      const data = await response.json();
      
      const params = new URLSearchParams({
        mode: "wine",
        requestId: data.requestId,
      });
      router.push(`/results?${params.toString()}`);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-rose-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-purple-100 mb-4">
            <Utensils className="w-7 h-7 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Find Food for Your Wine</h1>
          <p className="text-muted-foreground">Tell us about your wine and we'll suggest perfect dishes</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Wine Selection"}
              {step === 2 && "Wine Characteristics"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label>Select from Our Wine List</Label>
                  <Select
                    value={formData.wineName}
                    onValueChange={(value) => {
                      const wine = wines.find(w => w.name === value);
                      setFormData(prev => ({
                        ...prev,
                        wineName: value,
                        varietal: wine?.grape || prev.varietal,
                        region: wine?.origin || prev.region,
                      }));
                    }}
                  >
                    <SelectTrigger data-testid="select-wine">
                      <SelectValue placeholder="Choose a wine..." />
                    </SelectTrigger>
                    <SelectContent>
                      {wines.map(wine => (
                        <SelectItem key={wine.id} value={wine.name}>
                          {wine.name} ({wine.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="text-center text-muted-foreground text-sm">— or —</div>

                <div className="space-y-2">
                  <Label htmlFor="wineName">Enter Wine Name</Label>
                  <Input
                    id="wineName"
                    placeholder="e.g., Cabernet Sauvignon, Champagne..."
                    value={formData.wineName}
                    onChange={(e) => setFormData(prev => ({ ...prev, wineName: e.target.value }))}
                    data-testid="input-wine-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="varietal">Grape Varietal</Label>
                  <Input
                    id="varietal"
                    placeholder="e.g., Pinot Noir, Chardonnay..."
                    value={formData.varietal}
                    onChange={(e) => setFormData(prev => ({ ...prev, varietal: e.target.value }))}
                    data-testid="input-varietal"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region (optional)</Label>
                  <Input
                    id="region"
                    placeholder="e.g., Napa Valley, Burgundy..."
                    value={formData.region}
                    onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                    data-testid="input-region"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-3">
                  <Label>Sweetness: {formData.sweetness}</Label>
                  <Slider
                    value={[formData.sweetness]}
                    onValueChange={([value]) => setFormData(prev => ({ ...prev, sweetness: value }))}
                    max={5}
                    step={1}
                    data-testid="slider-sweetness"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Bone Dry</span>
                    <span>Sweet</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Body: {formData.body}</Label>
                  <Slider
                    value={[formData.body]}
                    onValueChange={([value]) => setFormData(prev => ({ ...prev, body: value }))}
                    max={5}
                    step={1}
                    data-testid="slider-body"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Light</span>
                    <span>Full</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Tannin: {formData.tannin}</Label>
                  <Slider
                    value={[formData.tannin]}
                    onValueChange={([value]) => setFormData(prev => ({ ...prev, tannin: value }))}
                    max={5}
                    step={1}
                    data-testid="slider-tannin"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Acidity: {formData.acidity}</Label>
                  <Slider
                    value={[formData.acidity]}
                    onValueChange={([value]) => setFormData(prev => ({ ...prev, acidity: value }))}
                    max={5}
                    step={1}
                    data-testid="slider-acidity"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Summary</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p><strong>Wine:</strong> {formData.wineName || "Not specified"}</p>
                    <p><strong>Varietal:</strong> {formData.varietal || "Not specified"}</p>
                    <p><strong>Region:</strong> {formData.region || "Not specified"}</p>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setStep(s => s - 1)}
                disabled={step === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {step < totalSteps ? (
                <Button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!formData.wineName && !formData.varietal}
                  data-testid="button-next"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading || (!formData.wineName && !formData.varietal)}
                  data-testid="button-submit"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Finding Pairings...
                    </>
                  ) : (
                    <>
                      Get Recommendations
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
