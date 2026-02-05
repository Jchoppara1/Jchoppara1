import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pairingRequests, pairingResults } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const results = await db
      .select()
      .from(pairingResults)
      .leftJoin(pairingRequests, eq(pairingResults.requestId, pairingRequests.id))
      .where(eq(pairingResults.requestId, id))
      .limit(1);

    if (results.length === 0) {
      return NextResponse.json(
        { error: "Result not found" },
        { status: 404 }
      );
    }

    const result = results[0];
    
    return NextResponse.json({
      id: result.pairing_results.id,
      requestId: result.pairing_results.requestId,
      mode: result.pairing_requests?.mode,
      inputs: result.pairing_requests?.inputs,
      results: result.pairing_results.results,
      confidence: result.pairing_results.confidence,
      createdAt: result.pairing_results.createdAt,
    });
  } catch (error) {
    console.error("Error fetching result:", error);
    return NextResponse.json(
      { error: "Failed to fetch result" },
      { status: 500 }
    );
  }
}
