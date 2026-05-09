import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET all students with pagination, search, filters
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.user = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    const [students, total] = await Promise.all([
      prisma.student.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true, createdAt: true } },
          room: { select: { id: true, roomNumber: true, type: true } },
        },
        orderBy: { user: { createdAt: "desc" } },
      }),
      prisma.student.count({ where }),
    ]);

    return NextResponse.json({ students, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("[STUDENTS_GET]", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}
