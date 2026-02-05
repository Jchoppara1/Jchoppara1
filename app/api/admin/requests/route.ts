import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const requests = await prisma.pairingRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        mode: true,
        createdAt: true,
      },
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }
}
