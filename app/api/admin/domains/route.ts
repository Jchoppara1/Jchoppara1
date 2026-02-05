import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sourceDomains } from "@/lib/schema";
import { asc, desc } from "drizzle-orm";

export async function GET() {
  try {
    const domains = await db
      .select()
      .from(sourceDomains)
      .orderBy(asc(sourceDomains.tier), desc(sourceDomains.weight));
    return NextResponse.json(domains);
  } catch (error) {
    console.error("Error fetching domains:", error);
    return NextResponse.json({ error: "Failed to fetch domains" }, { status: 500 });
  }
}
