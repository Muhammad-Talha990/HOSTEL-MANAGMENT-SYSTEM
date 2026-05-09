import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { paymentSchema } from "@/lib/validations";

// GET payments
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

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        include: { student: { include: { user: { select: { name: true, email: true } } } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.payment.count({ where }),
    ]);

    return NextResponse.json({ payments, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("[PAYMENTS_GET]", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

// POST create payment
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = paymentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.issues[0].message }, { status: 400 });
    }

    const payment = await prisma.payment.create({
      data: {
        studentId: validation.data.studentId,
        amount: validation.data.amount,
        status: "SUCCESS",
        paidAt: new Date(),
        transactionId: validation.data.transactionId || `TXN-${Date.now()}`,
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("[PAYMENTS_POST]", error);
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}
