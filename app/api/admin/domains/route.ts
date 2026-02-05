import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const domains = await prisma.sourceDomain.findMany({
      orderBy: [{ tier: "asc" }, { weight: "desc" }],
    });
    return NextResponse.json(domains);
  } catch (error) {
    console.error("Error fetching domains:", error);
    return NextResponse.json({ error: "Failed to fetch domains" }, { status: 500 });
  }
}
