import type { StockEntry } from "@/types";

const REGISTERED_BY_USER = { id: "u-001", name: "Edimilson Junior" };
const SUPPLIER_DISTRIBUTOR = "Distribuidora Esportiva BR";

export const stockEntriesFixture: StockEntry[] = [
  {
    id: "se-001",
    product: {
      id: "p-001",
      internalCode: "FWS-0001",
      name: "Camisa Brasil 2026 — Home",
    },
    quantity: 20,
    unitCost: 180,
    totalCost: 3600,
    supplier: SUPPLIER_DISTRIBUTOR,
    notes: null,
    isReverse: false,
    reverseOf: null,
    user: REGISTERED_BY_USER,
    createdAt: "2026-04-20T10:00:00.000Z",
  },
  {
    id: "se-002",
    product: {
      id: "p-002",
      internalCode: "FWS-0002",
      name: "Camisa Flamengo Retrô 1981",
    },
    quantity: 2,
    unitCost: 220,
    totalCost: 440,
    supplier: SUPPLIER_DISTRIBUTOR,
    notes: "Devolução por defeito",
    isReverse: true,
    reverseOf: "se-000",
    user: REGISTERED_BY_USER,
    createdAt: "2026-04-22T16:30:00.000Z",
  },
  {
    id: "se-003",
    product: {
      id: "p-004",
      internalCode: "FWS-0004",
      name: "Meião Corinthians Listrado",
    },
    quantity: 50,
    unitCost: 25,
    totalCost: 1250,
    supplier: "Importadora Listras Ltda",
    notes: null,
    isReverse: false,
    reverseOf: null,
    user: REGISTERED_BY_USER,
    createdAt: "2026-04-25T09:15:00.000Z",
  },
];
