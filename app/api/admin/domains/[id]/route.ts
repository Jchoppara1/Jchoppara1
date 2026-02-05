import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const domain = await prisma.sourceDomain.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(domain);
  } catch (error) {
    console.error("Error updating domain:", error);
    return NextResponse.json(
      { error: "Failed to update domain" },
      { status: 500 }
    );
  }
}
