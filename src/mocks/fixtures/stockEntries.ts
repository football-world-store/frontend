import type { StockEntry } from "@/types";

const REGISTERED_BY_USER_ID = "u-001";
const REGISTERED_BY_USER_NAME = "Edimilson Junior";
const SUPPLIER_DISTRIBUTOR = "Distribuidora Esportiva BR";

export const stockEntriesFixture: StockEntry[] = [
  {
    id: "se-001",
    productId: "p-001",
    productName: "Camisa Brasil 2026 — Home",
    movementType: "ENTRY",
    quantity: 20,
    unitCost: 180,
    supplier: SUPPLIER_DISTRIBUTOR,
    notes: null,
    reversedEntryId: null,
    userId: REGISTERED_BY_USER_ID,
    userName: REGISTERED_BY_USER_NAME,
    entryDate: "2026-04-20T10:00:00.000Z",
    createdAt: "2026-04-20T10:00:00.000Z",
  },
  {
    id: "se-002",
    productId: "p-002",
    productName: "Camisa Flamengo Retrô 1981",
    movementType: "REVERSE",
    quantity: 2,
    unitCost: 220,
    supplier: SUPPLIER_DISTRIBUTOR,
    notes: "Devolução por defeito",
    reversedEntryId: "se-000",
    userId: REGISTERED_BY_USER_ID,
    userName: REGISTERED_BY_USER_NAME,
    entryDate: "2026-04-22T16:30:00.000Z",
    createdAt: "2026-04-22T16:30:00.000Z",
  },
  {
    id: "se-003",
    productId: "p-004",
    productName: "Meião Corinthians Listrado",
    movementType: "ENTRY",
    quantity: 50,
    unitCost: 25,
    supplier: "Importadora Listras Ltda",
    notes: null,
    reversedEntryId: null,
    userId: REGISTERED_BY_USER_ID,
    userName: REGISTERED_BY_USER_NAME,
    entryDate: "2026-04-25T09:15:00.000Z",
    createdAt: "2026-04-25T09:15:00.000Z",
  },
];
