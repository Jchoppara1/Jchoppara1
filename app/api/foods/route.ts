import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { foods } from "@/lib/schema";
import { asc } from "drizzle-orm";

export async function GET() {
  try {
    const allFoods = await db.select().from(foods).orderBy(asc(foods.name));
    return NextResponse.json(allFoods);
  } catch (error) {
    console.error("Error fetching foods:", error);
    return NextResponse.json({ error: "Failed to fetch foods" }, { status: 500 });
  }
}
