import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const cache = await prisma.evidenceCache.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json(cache);
  } catch (error) {
    console.error("Error fetching cache:", error);
    return NextResponse.json({ error: "Failed to fetch cache" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await prisma.evidenceCache.deleteMany();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing cache:", error);
    return NextResponse.json({ error: "Failed to clear cache" }, { status: 500 });
  }
}
