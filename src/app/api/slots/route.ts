import { NextResponse } from "next/server";
import { ensureSlotsForDate, getSlotCapacity } from "@/lib/slots";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "Date required" }, { status: 400 });
    }

    const slots = await ensureSlotsForDate(date);
    const operatorsParam = searchParams.get("operators") ?? searchParams.get("pax");
    const requiredOperators = operatorsParam
      ? Math.max(1, parseInt(operatorsParam, 10) || 1)
      : 1;

    const result = slots.map((slot) => {
      const { capacity, booked, available } = getSlotCapacity(slot);
      return {
        id: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        capacity,
        booked,
        available,
        operators: slot.operators.map((so) => so.operator.name),
        bookable: capacity > 0 && available >= requiredOperators,
      };
    });

    return NextResponse.json({ date, slots: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Slots fetch failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
