import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const { requireAdmin } = await import("@/lib/auth");
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rules = await prisma.availabilityRule.findMany({ orderBy: { dayOfWeek: "asc" } });
  const overrides = await prisma.dateOverride.findMany({ orderBy: { date: "asc" } });
  return NextResponse.json({ rules, overrides });
}

export async function POST(request: Request) {
  const { requireAdmin } = await import("@/lib/auth");
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (body.type === "rule") {
    const rule = await prisma.availabilityRule.create({
      data: {
        dayOfWeek: body.dayOfWeek,
        startTime: body.startTime,
        endTime: body.endTime,
        active: body.active ?? true,
      },
    });
    return NextResponse.json(rule);
  }

  if (body.type === "override") {
    const override = await prisma.dateOverride.upsert({
      where: { date: new Date(body.date + "T00:00:00") },
      create: {
        date: new Date(body.date + "T00:00:00"),
        startTime: body.startTime,
        endTime: body.endTime,
        isClosed: body.isClosed ?? false,
      },
      update: {
        startTime: body.startTime,
        endTime: body.endTime,
        isClosed: body.isClosed ?? false,
      },
    });
    return NextResponse.json(override);
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

export async function DELETE(request: Request) {
  const { requireAdmin } = await import("@/lib/auth");
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type");

  if (!id || !type) {
    return NextResponse.json({ error: "Missing id or type" }, { status: 400 });
  }

  if (type === "rule") {
    await prisma.availabilityRule.delete({ where: { id } });
  } else if (type === "override") {
    await prisma.dateOverride.delete({ where: { id } });
  }

  return NextResponse.json({ success: true });
}

export async function PATCH(request: Request) {
  const { requireAdmin } = await import("@/lib/auth");
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, active } = await request.json();
  const rule = await prisma.availabilityRule.update({
    where: { id },
    data: { active },
  });
  return NextResponse.json(rule);
}
