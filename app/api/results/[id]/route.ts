import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pairingRequests, pairingResults } from "@/lib/schema";
import { eq } from "drizzle-orm";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id || id === "undefined" || id === "null" || !UUID_REGEX.test(id)) {
      return NextResponse.json(
        { error: "Invalid result ID" },
        { status: 400 }
      );
    }
    
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
