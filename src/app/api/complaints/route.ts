import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { complaintSchema } from "@/lib/validations";

// GET complaints
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const skip = (page - 1) * limit;
    const role = (session.user as any).role;

    const where: any = {};
    if (status && status !== "ALL") where.status = status;
    if (priority && priority !== "ALL") where.priority = priority;

    // Students can only see their own complaints
    if (role === "STUDENT") {
      const student = await prisma.student.findUnique({ where: { userId: session.user.id } });
      if (student) where.studentId = student.id;
    }

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        skip,
        take: limit,
        include: { student: { include: { user: { select: { name: true, email: true } } } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.complaint.count({ where }),
    ]);

    return NextResponse.json({ complaints, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("[COMPLAINTS_GET]", error);
    return NextResponse.json({ error: "Failed to fetch complaints" }, { status: 500 });
  }
}

// POST create complaint
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const validation = complaintSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const student = await prisma.student.findUnique({ where: { userId: session.user.id } });
    if (!student) return NextResponse.json({ error: "Student profile not found" }, { status: 404 });

    const complaint = await prisma.complaint.create({
      data: {
        ...validation.data,
        studentId: student.id,
      },
    });

    return NextResponse.json(complaint, { status: 201 });
  } catch (error) {
    console.error("[COMPLAINTS_POST]", error);
    return NextResponse.json({ error: "Failed to create complaint" }, { status: 500 });
  }
}
