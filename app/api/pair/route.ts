import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wines, foods, pairingRequests, pairingResults } from "@/lib/schema";
import { getWineRecommendations, getFoodRecommendations, type DishInput, type WineInput, type PairingCandidate } from "@/lib/pairingRules";
import { searchEvidence, calculateConfidence, type EvidenceResult } from "@/lib/evidenceEngine";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) {
    return false;
  }
  
  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { mode, inputs } = body;

    if (!mode || !inputs) {
      return NextResponse.json(
        { error: "Missing mode or inputs" },
        { status: 400 }
      );
    }

    const [pairingRequest] = await db.insert(pairingRequests).values({
      mode,
      inputs: inputs as Record<string, unknown>,
    }).returning();

    let results: PairingCandidate[];
    let evidence: EvidenceResult;
    let confidence: number;

    if (mode === "dish") {
      const dishInput = inputs as DishInput;
      const allWines = await db.select().from(wines);
      
      const candidates = getWineRecommendations(dishInput, allWines);
      
      const searchQuery = dishInput.dishName + (dishInput.protein ? ` ${dishInput.protein}` : "");
      evidence = await searchEvidence(searchQuery, "dish", inputs);
      
      const boostedCandidates = candidates.map(candidate => {
        let boost = 0;
        for (const item of evidence.items) {
          const snippetLower = item.snippet.toLowerCase();
          const nameLower = candidate.name.toLowerCase();
          const varietalLower = (candidate.varietal || "").toLowerCase();
          
          if (snippetLower.includes(nameLower) || snippetLower.includes(varietalLower)) {
            boost += item.weight * 10;
          }
        }
        return {
          ...candidate,
          score: candidate.score + boost,
        };
      });

      boostedCandidates.sort((a, b) => b.score - a.score);
      results = boostedCandidates.slice(0, 3);
      
      const matchingEvidence = results.reduce((count, r) => {
        return count + evidence.items.filter((e) => 
          e.snippet.toLowerCase().includes((r.varietal || "").toLowerCase())
        ).length;
      }, 0);
      
      confidence = calculateConfidence(results[0]?.score || 50, evidence.items, matchingEvidence);
    } else {
      const wineInput = inputs as WineInput;
      const allFoods = await db.select().from(foods);
      
      const candidates = getFoodRecommendations(wineInput, allFoods);
      
      const searchQuery = wineInput.wineName || wineInput.varietal || "wine";
      evidence = await searchEvidence(searchQuery, "wine", inputs);
      
      const boostedCandidates = candidates.map(candidate => {
        let boost = 0;
        for (const item of evidence.items) {
          const snippetLower = item.snippet.toLowerCase();
          const nameLower = candidate.name.toLowerCase();
          
          if (snippetLower.includes(nameLower)) {
            boost += item.weight * 10;
          }
        }
        return {
          ...candidate,
          score: candidate.score + boost,
        };
      });

      boostedCandidates.sort((a, b) => b.score - a.score);
      results = boostedCandidates.slice(0, 3);
      
      const matchingEvidence = results.reduce((count, r) => {
        return count + evidence.items.filter((e) => 
          e.snippet.toLowerCase().includes(r.name.toLowerCase())
        ).length;
      }, 0);
      
      confidence = calculateConfidence(results[0]?.score || 50, evidence.items, matchingEvidence);
    }

    await db.insert(pairingResults).values({
      requestId: pairingRequest.id,
      results: {
        pairings: results,
        evidence: evidence.items,
        evidenceCached: evidence.cached,
      },
      confidence,
    });

    return NextResponse.json({
      requestId: pairingRequest.id,
      results,
      evidence: evidence.items,
      confidence,
      mode,
    });
  } catch (error) {
    console.error("Pairing error:", error);
    return NextResponse.json(
      { error: "Failed to generate pairings" },
      { status: 500 }
    );
  }
}
