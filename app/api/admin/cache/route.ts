import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { evidenceCache } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const cache = await db
      .select()
      .from(evidenceCache)
      .orderBy(desc(evidenceCache.createdAt))
      .limit(50);
    return NextResponse.json(cache);
  } catch (error) {
    console.error("Error fetching cache:", error);
    return NextResponse.json({ error: "Failed to fetch cache" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await db.delete(evidenceCache);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing cache:", error);
    return NextResponse.json({ error: "Failed to clear cache" }, { status: 500 });
  }
}
