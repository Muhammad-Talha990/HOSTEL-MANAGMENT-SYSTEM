import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations";

// GET bookings
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const skip = (page - 1) * limit;
    const role = (session.user as any).role;

    const where: any = {};
    if (status && status !== "ALL") where.status = status;

    if (role === "STUDENT") {
      const student = await prisma.student.findUnique({ where: { userId: session.user.id } });
      if (student) where.studentId = student.id;
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          student: {
            include: {
              user: { select: { name: true, email: true } },
              room: { select: { roomNumber: true, type: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.booking.count({ where }),
    ]);

    return NextResponse.json({ bookings, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("[BOOKINGS_GET]", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

// POST create booking
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const validation = bookingSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        studentId: validation.data.studentId,
        checkIn: new Date(validation.data.checkIn),
        checkOut: new Date(validation.data.checkOut),
        status: "PENDING",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("[BOOKINGS_POST]", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
