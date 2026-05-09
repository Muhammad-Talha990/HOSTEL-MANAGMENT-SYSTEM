import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { roomSchema } from "@/lib/validations";

// GET single room
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const room = await prisma.room.findUnique({
      where: { id },
      include: { students: { include: { user: true } } },
    });
    if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });
    return NextResponse.json(room);
  } catch {
    return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 });
  }
}

// PUT update room
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = roomSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const room = await prisma.room.update({
      where: { id },
      data: validation.data,
    });
    return NextResponse.json(room);
  } catch {
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 });
  }
}

// DELETE room
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.room.delete({ where: { id } });
    return NextResponse.json({ message: "Room deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 });
  }
}
