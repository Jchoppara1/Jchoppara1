import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sourceDomains } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { verifySession } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await verifySession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    const [domain] = await db
      .update(sourceDomains)
      .set(body)
      .where(eq(sourceDomains.id, id))
      .returning();

    return NextResponse.json(domain);
  } catch (error) {
    console.error("Error updating domain:", error);
    return NextResponse.json(
      { error: "Failed to update domain" },
      { status: 500 }
    );
  }
}
