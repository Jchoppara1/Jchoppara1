import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const wines = await prisma.wine.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(wines);
  } catch (error) {
    console.error("Error fetching wines:", error);
    return NextResponse.json({ error: "Failed to fetch wines" }, { status: 500 });
  }
}
