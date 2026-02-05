"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Wine, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const proteins = [
  { value: "beef", label: "Beef" },
  { value: "lamb", label: "Lamb" },
  { value: "pork", label: "Pork" },
  { value: "poultry", label: "Poultry" },
  { value: "fish", label: "Fish" },
  { value: "shellfish", label: "Shellfish" },
  { value: "veg", label: "Vegetarian" },
  { value: "cheese", label: "Cheese" },
];

const cookingMethods = [
  { value: "grilled", label: "Grilled" },
  { value: "roasted", label: "Roasted" },
  { value: "fried", label: "Fried" },
  { value: "braised", label: "Braised" },
  { value: "raw", label: "Raw" },
  { value: "steamed", label: "Steamed" },
];

const flavorOptions = [
  "spicy", "creamy", "smoky", "citrus", "herbaceous", "sweet", "umami", "earthy", "tangy", "rich"
];

const wineColors = [
  { value: "any", label: "Any" },
  { value: "red", label: "Red" },
  { value: "white", label: "White" },
  { value: "rose", label: "Rosé" },
  { value: "sparkling", label: "Sparkling" },
];

export default function DishWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    dishName: "",
    protein: "",
    sauce: "",
    cookingMethod: "",
    flavorNotes: [] as string[],
    heatLevel: 0,
    sweetnessLevel: 0,
    budget: "",
    preferredColor: "any",
  });

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const toggleFlavor = (flavor: string) => {
    setFormData(prev => ({
      ...prev,
      flavorNotes: prev.flavorNotes.includes(flavor)
        ? prev.flavorNotes.filter(f => f !== flavor)
        : [...prev.flavorNotes, flavor]
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "dish",
          inputs: formData,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.requestId) {
        console.error("Error:", data.error || "Failed to get pairing results");
        setLoading(false);
        return;
      }
      
      const params = new URLSearchParams({
        mode: "dish",
        requestId: data.requestId,
      });
      router.push(`/results?${params.toString()}`);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-100 mb-4">
            <Wine className="w-7 h-7 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Find Wine for Your Dish</h1>
          <p className="text-muted-foreground">Tell us about your dish and we'll recommend perfect wines</p>
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
              {step === 1 && "Basic Information"}
              {step === 2 && "Flavors & Preparation"}
              {step === 3 && "Preferences"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="dishName">Dish Name *</Label>
                  <Input
                    id="dishName"
                    placeholder="e.g., Lamb Kabob, Grilled Salmon..."
                    value={formData.dishName}
                    onChange={(e) => setFormData(prev => ({ ...prev, dishName: e.target.value }))}
                    data-testid="input-dish-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Primary Protein</Label>
                  <Select
                    value={formData.protein}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, protein: value }))}
                  >
                    <SelectTrigger data-testid="select-protein">
                      <SelectValue placeholder="Select protein..." />
                    </SelectTrigger>
                    <SelectContent>
                      {proteins.map(p => (
                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sauce">Sauce or Style</Label>
                  <Input
                    id="sauce"
                    placeholder="e.g., red wine reduction, tahini, harissa..."
                    value={formData.sauce}
                    onChange={(e) => setFormData(prev => ({ ...prev, sauce: e.target.value }))}
                    data-testid="input-sauce"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label>Cooking Method</Label>
                  <Select
                    value={formData.cookingMethod}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, cookingMethod: value }))}
                  >
                    <SelectTrigger data-testid="select-cooking-method">
                      <SelectValue placeholder="Select method..." />
                    </SelectTrigger>
                    <SelectContent>
                      {cookingMethods.map(m => (
                        <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Flavor Notes (select all that apply)</Label>
                  <div className="flex flex-wrap gap-2">
                    {flavorOptions.map(flavor => (
                      <Badge
                        key={flavor}
                        variant={formData.flavorNotes.includes(flavor) ? "default" : "outline"}
                        className="cursor-pointer capitalize"
                        onClick={() => toggleFlavor(flavor)}
                        data-testid={`badge-flavor-${flavor}`}
                      >
                        {flavor}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Heat Level: {formData.heatLevel}</Label>
                  <Slider
                    value={[formData.heatLevel]}
                    onValueChange={([value]) => setFormData(prev => ({ ...prev, heatLevel: value }))}
                    max={5}
                    step={1}
                    data-testid="slider-heat"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Mild</span>
                    <span>Very Spicy</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Sweetness Level: {formData.sweetnessLevel}</Label>
                  <Slider
                    value={[formData.sweetnessLevel]}
                    onValueChange={([value]) => setFormData(prev => ({ ...prev, sweetnessLevel: value }))}
                    max={5}
                    step={1}
                    data-testid="slider-sweetness"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Savory</span>
                    <span>Sweet</span>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-2">
                  <Label>Preferred Wine Color</Label>
                  <Select
                    value={formData.preferredColor}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, preferredColor: value }))}
                  >
                    <SelectTrigger data-testid="select-wine-color">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {wineColors.map(c => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget per Bottle ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="e.g., 50"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    data-testid="input-budget"
                  />
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Summary</h4>
                  <div className="text-sm space-y-1 text-muted-foreground">
                    <p><strong>Dish:</strong> {formData.dishName || "Not specified"}</p>
                    <p><strong>Protein:</strong> {formData.protein || "Not specified"}</p>
                    <p><strong>Cooking:</strong> {formData.cookingMethod || "Not specified"}</p>
                    <p><strong>Flavors:</strong> {formData.flavorNotes.join(", ") || "None selected"}</p>
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
                  disabled={step === 1 && !formData.dishName}
                  data-testid="button-next"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !formData.dishName}
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
