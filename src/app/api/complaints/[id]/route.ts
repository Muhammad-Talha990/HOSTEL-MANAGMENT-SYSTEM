import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PATCH update complaint status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const role = (session.user as any).role;
    if (role === "STUDENT") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const { status } = body;

    if (!["OPEN", "IN_PROGRESS", "RESOLVED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const complaint = await prisma.complaint.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(complaint);
  } catch {
    return NextResponse.json({ error: "Failed to update complaint" }, { status: 500 });
  }
}

// DELETE complaint
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.complaint.delete({ where: { id } });
    return NextResponse.json({ message: "Complaint deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete complaint" }, { status: 500 });
  }
}
