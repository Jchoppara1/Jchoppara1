import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { wines } from "@/lib/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const allWines = await db.select().from(wines).orderBy(asc(wines.name));
    return NextResponse.json(allWines);
  } catch (error) {
    console.error("Error fetching wines:", error);
    return NextResponse.json({ error: "Failed to fetch wines" }, { status: 500 });
  }
}
