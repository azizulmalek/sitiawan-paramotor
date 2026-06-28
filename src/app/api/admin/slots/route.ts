import { NextResponse } from "next/server";
import { startOfDay } from "date-fns";
import { prisma } from "@/lib/db";
import { ensureSlotsForDate } from "@/lib/slots";

export async function GET(request: Request) {
  const { requireAdmin } = await import("@/lib/auth");
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Date required" }, { status: 400 });
  }

  const slots = await ensureSlotsForDate(date);
  return NextResponse.json(slots);
}

export async function POST(request: Request) {
  const { requireAdmin } = await import("@/lib/auth");
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slotId, operatorIds } = await request.json() as { slotId: string; operatorIds: string[] };

  if (!slotId || !Array.isArray(operatorIds)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  await prisma.slotOperator.deleteMany({ where: { slotId } });

  if (operatorIds.length > 0) {
    await prisma.slotOperator.createMany({
      data: operatorIds.map((operatorId) => ({ slotId, operatorId })),
    });
  }

  const slot = await prisma.timeSlot.findUnique({
    where: { id: slotId },
    include: { operators: { include: { operator: true } }, bookings: true },
  });

  return NextResponse.json(slot);
}

export async function PUT(request: Request) {
  const { requireAdmin } = await import("@/lib/auth");
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { date, assignments } = await request.json() as {
    date: string;
    assignments: { slotId: string; operatorIds: string[] }[];
  };

  await ensureSlotsForDate(date);

  for (const { slotId, operatorIds } of assignments) {
    await prisma.slotOperator.deleteMany({ where: { slotId } });
    if (operatorIds.length > 0) {
      await prisma.slotOperator.createMany({
        data: operatorIds.map((operatorId) => ({ slotId, operatorId })),
      });
    }
  }

  const slots = await prisma.timeSlot.findMany({
    where: { date: startOfDay(new Date(date + "T00:00:00")) },
    include: { operators: { include: { operator: true } } },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json(slots);
}
