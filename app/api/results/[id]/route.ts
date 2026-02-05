import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await prisma.pairingResult.findFirst({
      where: { requestId: params.id },
      include: { request: true },
    });

    if (!result) {
      return NextResponse.json(
        { error: "Result not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: result.id,
      requestId: result.requestId,
      mode: result.request.mode,
      inputs: result.request.inputs,
      results: result.results,
      confidence: result.confidence,
      createdAt: result.createdAt,
    });
  } catch (error) {
    console.error("Error fetching result:", error);
    return NextResponse.json(
      { error: "Failed to fetch result" },
      { status: 500 }
    );
  }
}
