import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { roomSchema } from "@/lib/validations";

// GET all rooms
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status && status !== "ALL") where.status = status;
    if (search) where.roomNumber = { contains: search, mode: "insensitive" };

    const [rooms, total] = await Promise.all([
      prisma.room.findMany({
        where,
        skip,
        take: limit,
        include: { students: { include: { user: true } } },
        orderBy: { roomNumber: "asc" },
      }),
      prisma.room.count({ where }),
    ]);

    return NextResponse.json({ rooms, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}

// POST create room
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = roomSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const existing = await prisma.room.findUnique({ where: { roomNumber: validation.data.roomNumber } });
    if (existing) {
      return NextResponse.json({ error: "Room number already exists" }, { status: 409 });
    }

    const room = await prisma.room.create({ data: validation.data });
    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
