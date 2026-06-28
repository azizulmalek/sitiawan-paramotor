import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const reviews = await prisma.review.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  const { requireAdmin } = await import("@/lib/auth");
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const review = await prisma.review.create({
    data: {
      author: body.author,
      text: body.text,
      rating: body.rating ?? 5,
      location: body.location || null,
      imageUrl: body.imageUrl || null,
      sortOrder: body.sortOrder ?? 0,
      active: body.active ?? true,
    },
  });
  return NextResponse.json(review);
}

export async function PATCH(request: Request) {
  const { requireAdmin } = await import("@/lib/auth");
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, ...data } = await request.json();
  const review = await prisma.review.update({ where: { id }, data });
  return NextResponse.json(review);
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

  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
