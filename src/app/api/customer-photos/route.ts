import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const photos = await prisma.customerPhoto.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(photos);
}

export async function POST(request: Request) {
  const { requireAdmin } = await import("@/lib/auth");
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const photo = await prisma.customerPhoto.create({
    data: {
      imageUrl: body.imageUrl,
      caption: body.caption || null,
      sortOrder: body.sortOrder ?? 0,
      active: body.active ?? true,
    },
  });
  return NextResponse.json(photo);
}

export async function PATCH(request: Request) {
  const { requireAdmin } = await import("@/lib/auth");
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, ...data } = await request.json();
  const photo = await prisma.customerPhoto.update({ where: { id }, data });
  return NextResponse.json(photo);
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

  await prisma.customerPhoto.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
