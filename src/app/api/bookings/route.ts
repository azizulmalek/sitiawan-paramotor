import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSlotCapacity } from "@/lib/slots";
import {
  calculateItemsTotal,
  getOperatorsForItems,
  getPackageById,
  validateBookingItems,
  type BookingItemInput,
  type PackageId,
} from "@/lib/packages";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slotId, items: rawItems, customerName, customerEmail, customerPhone, notes } = body;

    if (!slotId || !customerName || !customerEmail || !customerPhone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const items: BookingItemInput[] = Array.isArray(rawItems)
      ? rawItems.map((item: { packageId: string; quantity: number }) => ({
          packageId: item.packageId as PackageId,
          quantity: parseInt(String(item.quantity), 10),
        }))
      : [];

    const itemsError = validateBookingItems(items);
    if (itemsError) {
      return NextResponse.json({ error: itemsError }, { status: 400 });
    }

    const operatorsRequired = getOperatorsForItems(items);
    const totalPrice = calculateItemsTotal(items);

    const slot = await prisma.timeSlot.findUnique({
      where: { id: slotId },
      include: {
        operators: true,
        bookings: {
          where: { status: { not: "cancelled" } },
          include: { items: true },
        },
      },
    });

    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    const { capacity, available } = getSlotCapacity(slot);
    if (capacity === 0) {
      return NextResponse.json({ error: "No operators assigned to this slot" }, { status: 400 });
    }
    if (available < operatorsRequired) {
      return NextResponse.json(
        {
          error: `Not enough operator spots. This slot has ${available} available but your booking needs ${operatorsRequired}.`,
        },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        slotId,
        packageId: items[0].packageId,
        paxCount: operatorsRequired,
        totalPrice,
        customerName,
        customerEmail,
        customerPhone,
        notes: notes || null,
        items: {
          create: items.map((item) => ({
            packageId: item.packageId,
            quantity: item.quantity,
            unitPrice: getPackageById(item.packageId)?.price ?? 0,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, booking });
  } catch {
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { requireAdmin } = await import("@/lib/auth");
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  const where = date
    ? { slot: { date: new Date(date + "T00:00:00") } }
    : {};

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      items: true,
      slot: { include: { operators: { include: { operator: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}
