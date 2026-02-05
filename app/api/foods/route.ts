import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const foods = await prisma.food.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json(foods);
  } catch (error) {
    console.error("Error fetching foods:", error);
    return NextResponse.json({ error: "Failed to fetch foods" }, { status: 500 });
  }
}
