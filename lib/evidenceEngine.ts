import { db } from "./db";
import { sourceDomains, evidenceCache } from "./schema";
import { eq, gt, and } from "drizzle-orm";

export interface EvidenceItem {
  title: string;
  url: string;
  domain: string;
  snippet: string;
  tier: string;
  weight: number;
}

export interface EvidenceResult {
  items: EvidenceItem[];
  cached: boolean;
}

const DEFAULT_DOMAINS = [
  { domain: "guildsomm.com", tier: "A", weight: 1.0 },
  { domain: "jancisrobinson.com", tier: "A", weight: 1.0 },
  { domain: "winespectator.com", tier: "A", weight: 1.0 },
  { domain: "decanter.com", tier: "A", weight: 1.0 },
  { domain: "wineenthusiast.com", tier: "B", weight: 0.8 },
  { domain: "thewinesociety.com", tier: "B", weight: 0.8 },
  { domain: "masterclass.com", tier: "B", weight: 0.8 },
  { domain: "winefolly.com", tier: "C", weight: 0.6 },
  { domain: "vivino.com", tier: "C", weight: 0.4 },
];

function hashInputs(inputs: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(inputs)).toString("base64").slice(0, 64);
}

async function getSourceDomains(): Promise<Array<{ domain: string; tier: string; weight: number; enabled: boolean }>> {
  try {
    const domains = await db.select().from(sourceDomains).where(eq(sourceDomains.enabled, true));
    return domains.length > 0 ? domains : DEFAULT_DOMAINS.map(d => ({ ...d, enabled: true }));
  } catch {
    return DEFAULT_DOMAINS.map(d => ({ ...d, enabled: true }));
  }
}

export async function searchEvidence(
  query: string,
  mode: "dish" | "wine",
  inputs: Record<string, unknown>
): Promise<EvidenceResult> {
  const inputsHash = hashInputs(inputs);
  const queryKey = query.toLowerCase().trim();

  try {
    const cached = await db
      .select()
      .from(evidenceCache)
      .where(
        and(
          eq(evidenceCache.queryKey, queryKey),
          eq(evidenceCache.mode, mode),
          eq(evidenceCache.inputsHash, inputsHash),
          gt(evidenceCache.expiresAt, new Date())
        )
      )
      .limit(1);

    if (cached.length > 0) {
      return {
        items: cached[0].items as EvidenceItem[],
        cached: true,
      };
    }
  } catch {
  }

  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    return { items: [], cached: false };
  }

  const enabledDomains = await getSourceDomains();

  const queries = [
    `best wine pairing for ${query}`,
    `${query} wine pairing sommelier`,
    `${query} food and wine match`,
  ];

  const allResults: EvidenceItem[] = [];

  for (const searchQuery of queries) {
    try {
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: searchQuery,
          num: 10,
        }),
      });

      if (!response.ok) continue;

      const data = await response.json();
      const organic = data.organic || [];

      for (const result of organic) {
        const url = result.link || "";
        const domain = extractDomain(url);
        
        const matchedSource = enabledDomains.find(d => 
          domain.includes(d.domain) || d.domain.includes(domain)
        );

        if (matchedSource) {
          const existing = allResults.find(r => r.url === url);
          if (!existing) {
            allResults.push({
              title: result.title || "",
              url,
              domain: matchedSource.domain,
              snippet: result.snippet || "",
              tier: matchedSource.tier,
              weight: matchedSource.weight,
            });
          }
        }
      }
    } catch {
    }
  }

  const uniqueResults = deduplicateResults(allResults);
  const sortedResults = uniqueResults
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 6);

  if (sortedResults.length > 0) {
    try {
      await db.insert(evidenceCache).values({
        queryKey,
        mode,
        inputsHash,
        items: sortedResults,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    } catch {
    }
  }

  return {
    items: sortedResults,
    cached: false,
  };
}

function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace("www.", "");
  } catch {
    return "";
  }
}

function deduplicateResults(results: EvidenceItem[]): EvidenceItem[] {
  const seen = new Map<string, EvidenceItem>();
  
  for (const result of results) {
    const key = result.title.toLowerCase().slice(0, 50);
    if (!seen.has(key) || seen.get(key)!.weight < result.weight) {
      seen.set(key, result);
    }
  }
  
  return Array.from(seen.values());
}

export function calculateConfidence(
  ruleScore: number,
  evidenceItems: EvidenceItem[],
  matchingEvidence: number
): number {
  let baseConfidence = Math.min(ruleScore, 100);
  
  if (evidenceItems.length > 0) {
    const evidenceBoost = Math.min(matchingEvidence * 5, 20);
    const tierBoost = evidenceItems
      .filter((_, i) => i < matchingEvidence)
      .reduce((sum, e) => sum + (e.tier === "A" ? 5 : e.tier === "B" ? 3 : 1), 0);
    
    baseConfidence += evidenceBoost + tierBoost;
  }

  return Math.min(Math.round(baseConfidence), 100);
}
