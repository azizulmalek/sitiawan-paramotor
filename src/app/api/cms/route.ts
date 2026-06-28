import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCmsItems } from "@/lib/cms";

export async function GET() {
  const items = await getCmsItems();
  const map: Record<string, { content: string; title: string | null; imageUrl: string | null }> = {};
  for (const item of items) {
    map[item.key] = { content: item.content, title: item.title, imageUrl: item.imageUrl };
  }
  return NextResponse.json(map);
}

export async function PUT(request: Request) {
  const { requireAdmin } = await import("@/lib/auth");
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items } = await request.json() as {
    items: { key: string; content: string; title?: string; imageUrl?: string }[];
  };

  for (const item of items) {
    await prisma.cmsContent.upsert({
      where: { key: item.key },
      create: {
        key: item.key,
        content: item.content,
        title: item.title ?? null,
        imageUrl: item.imageUrl ?? null,
      },
      update: {
        content: item.content,
        title: item.title ?? null,
        imageUrl: item.imageUrl ?? null,
      },
    });
  }

  return NextResponse.json({ success: true });
}
