import type { StockEntry } from "@/types";

export const stockEntriesFixture: StockEntry[] = [
  {
    id: "se-001",
    productId: "p-001",
    productName: "Camisa Brasil 2026 — Home",
    type: "ENTRY",
    quantity: 20,
    unitCost: 180,
    registeredAt: "2026-04-20T10:00:00.000Z",
    registeredBy: "Edimilson",
  },
  {
    id: "se-002",
    productId: "p-002",
    productName: "Camisa Flamengo Retrô 1981",
    type: "REVERSE",
    quantity: 2,
    unitCost: 220,
    registeredAt: "2026-04-22T16:30:00.000Z",
    registeredBy: "Edimilson",
  },
  {
    id: "se-003",
    productId: "p-004",
    productName: "Meião Corinthians Listrado",
    type: "ENTRY",
    quantity: 50,
    unitCost: 25,
    registeredAt: "2026-04-25T09:15:00.000Z",
    registeredBy: "Edimilson",
  },
];
