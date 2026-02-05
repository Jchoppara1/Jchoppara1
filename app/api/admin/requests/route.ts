import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { pairingRequests } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const requests = await db
      .select({
        id: pairingRequests.id,
        mode: pairingRequests.mode,
        createdAt: pairingRequests.createdAt,
      })
      .from(pairingRequests)
      .orderBy(desc(pairingRequests.createdAt))
      .limit(50);
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}
