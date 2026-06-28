import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const operators = await prisma.operator.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { slotAssignments: true } } },
  });
  return NextResponse.json(operators);
}

export async function POST(request: Request) {
  const { requireAdmin } = await import("@/lib/auth");
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const operator = await prisma.operator.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      bio: body.bio,
      photoUrl: body.photoUrl,
      experience: body.experience,
      background: body.background,
      certifications: body.certifications,
      sortOrder: body.sortOrder ?? 0,
      showOnHomepage: body.showOnHomepage ?? true,
      active: body.active ?? true,
    },
  });
  return NextResponse.json(operator);
}

export async function PATCH(request: Request) {
  const { requireAdmin } = await import("@/lib/auth");
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, ...data } = await request.json();
  const operator = await prisma.operator.update({ where: { id }, data });
  return NextResponse.json(operator);
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
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.operator.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
