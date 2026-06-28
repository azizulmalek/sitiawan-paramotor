export type PackageId = "solo" | "adult-child" | "duo";

export type BookingItemInput = {
  packageId: PackageId | string;
  quantity: number;
};

export type FlightPackage = {
  id: PackageId;
  title: string;
  duration: string;
  audience: string;
  originalPrice: number;
  price: number;
  operatorsPerUnit: number;
  priceBreakdown?: string;
  note: string;
};

export const FLIGHT_PACKAGES: FlightPackage[] = [
  {
    id: "solo",
    title: "Solo Flight",
    duration: "20 minutes",
    audience: "1 flyer · Ages 13 to adult",
    originalPrice: 189,
    price: 150,
    operatorsPerUnit: 1,
    note: "One tandem flight for one person.",
  },
  {
    id: "adult-child",
    title: "Adult + Child",
    duration: "20 minutes",
    audience: "1 adult + 1 child (5–12 yrs)",
    originalPrice: 239,
    price: 200,
    operatorsPerUnit: 1,
    priceBreakdown: "Child rides with the adult on the same flight",
    note: "Uses 1 operator — child does not fly alone.",
  },
  {
    id: "duo",
    title: "2 Pax Package",
    duration: "20 minutes each",
    audience: "2 flyers · Ages 13 to adult",
    originalPrice: 378,
    price: 300,
    operatorsPerUnit: 2,
    note: "Includes 1 free child (5–12) who rides with an adult — no extra operator.",
  },
];

export function getPackageById(id: string): FlightPackage | undefined {
  return FLIGHT_PACKAGES.find((p) => p.id === id);
}

export function isValidPackageId(id: string): id is PackageId {
  return FLIGHT_PACKAGES.some((p) => p.id === id);
}

export function getOperatorsPerPackage(packageId: PackageId): number {
  return getPackageById(packageId)?.operatorsPerUnit ?? 1;
}

/** Legacy bookings stored paxCount as operator slots with old 1:1 logic. */
export function getLegacyOperatorsUsed(packageId: string, paxCount: number): number {
  if (packageId === "adult-child") return paxCount >= 1 ? 1 : 0;
  if (packageId === "duo") return Math.min(paxCount, 2);
  return Math.max(1, paxCount);
}

export function getOperatorsForItems(items: BookingItemInput[]): number {
  return items.reduce((sum, item) => {
    const pkg = getPackageById(item.packageId);
    return sum + item.quantity * (pkg?.operatorsPerUnit ?? 1);
  }, 0);
}

export function calculateItemsTotal(items: BookingItemInput[]): number {
  return items.reduce((sum, item) => {
    const pkg = getPackageById(item.packageId);
    return sum + (pkg?.price ?? 0) * item.quantity;
  }, 0);
}

export function validateBookingItems(items: BookingItemInput[]): string | null {
  if (!items.length) return "Add at least one package";

  for (const item of items) {
    if (!isValidPackageId(item.packageId)) return "Invalid package selected";
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 20) {
      return "Each package quantity must be between 1 and 20";
    }
  }

  if (getOperatorsForItems(items) < 1) {
    return "Booking must use at least one operator spot";
  }

  return null;
}

export function formatBookingItemsSummary(items: BookingItemInput[]): string {
  return items
    .map((item) => {
      const pkg = getPackageById(item.packageId);
      const label = pkg?.title ?? item.packageId;
      return item.quantity > 1 ? `${item.quantity}× ${label}` : label;
    })
    .join(", ");
}
