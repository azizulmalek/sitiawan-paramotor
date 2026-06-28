import { addMinutes, format, parse, startOfDay } from "date-fns";
import { prisma } from "./db";
import {
  getLegacyOperatorsUsed,
  getOperatorsForItems,
  type BookingItemInput,
} from "./packages";

const SLOT_DURATION_MINUTES = 30;

function parseTime(time: string): Date {
  return parse(time, "HH:mm", new Date());
}

function formatTime(date: Date): string {
  return format(date, "HH:mm");
}

function generateTimeBlocks(startTime: string, endTime: string): string[] {
  const blocks: string[] = [];
  let current = parseTime(startTime);
  const end = parseTime(endTime);

  while (current < end) {
    const next = addMinutes(current, SLOT_DURATION_MINUTES);
    if (next <= end) {
      blocks.push(formatTime(current));
    }
    current = next;
  }

  return blocks;
}

export async function getAvailabilityForDate(dateStr: string) {
  const date = startOfDay(new Date(dateStr + "T00:00:00"));

  const override = await prisma.dateOverride.findUnique({ where: { date } });
  if (override?.isClosed) return null;

  if (override?.startTime && override?.endTime) {
    return { startTime: override.startTime, endTime: override.endTime };
  }

  const dayOfWeek = date.getDay();
  const rule = await prisma.availabilityRule.findFirst({
    where: { dayOfWeek, active: true },
  });

  if (!rule) return null;
  return { startTime: rule.startTime, endTime: rule.endTime };
}

export async function ensureSlotsForDate(dateStr: string) {
  const availability = await getAvailabilityForDate(dateStr);
  if (!availability) return [];

  const date = startOfDay(new Date(dateStr + "T00:00:00"));
  const blocks = generateTimeBlocks(availability.startTime, availability.endTime);

  for (const startTime of blocks) {
    const start = parseTime(startTime);
    const endTime = formatTime(addMinutes(start, SLOT_DURATION_MINUTES));

    await prisma.timeSlot.upsert({
      where: {
        date_startTime: { date, startTime },
      },
      create: { date, startTime, endTime },
      update: { endTime },
    });
  }

  return prisma.timeSlot.findMany({
    where: { date },
    orderBy: { startTime: "asc" },
    include: {
      operators: { include: { operator: true } },
      bookings: {
        where: { status: { not: "cancelled" } },
        include: { items: true },
      },
    },
  });
}

export function getBookingOperatorsUsed(booking: {
  packageId?: string;
  paxCount?: number;
  items?: BookingItemInput[];
}): number {
  if (booking.items && booking.items.length > 0) {
    return getOperatorsForItems(booking.items);
  }
  return getLegacyOperatorsUsed(booking.packageId ?? "solo", booking.paxCount ?? 1);
}

export function getSlotCapacity(slot: {
  operators: unknown[];
  bookings: {
    packageId?: string;
    paxCount?: number;
    items?: BookingItemInput[];
  }[];
}) {
  const capacity = slot.operators.length;
  const booked = slot.bookings.reduce(
    (sum, b) => sum + getBookingOperatorsUsed(b),
    0
  );
  return { capacity, booked, available: Math.max(0, capacity - booked) };
}

export { SLOT_DURATION_MINUTES, generateTimeBlocks };
