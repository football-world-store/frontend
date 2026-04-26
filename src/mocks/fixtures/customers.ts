import type { Customer } from "@/types";

export const customersFixture: Customer[] = [
  {
    id: "c-001",
    name: "Lucas Andrade",
    phone: "+55 11 99999-1111",
    email: "lucas@example.com",
    status: "ACTIVE",
    totalSpent: 2890.4,
    totalOrders: 12,
    lastPurchaseAt: "2026-04-23T13:00:00.000Z",
    createdAt: "2025-09-12T10:00:00.000Z",
  },
  {
    id: "c-002",
    name: "Carolina Mendes",
    phone: "+55 11 98888-2222",
    email: "carolina@example.com",
    status: "COOLING",
    totalSpent: 1290.0,
    totalOrders: 5,
    lastPurchaseAt: "2026-02-08T18:00:00.000Z",
    createdAt: "2024-11-04T11:00:00.000Z",
  },
  {
    id: "c-003",
    name: "Rafael Souza",
    phone: null,
    email: "rafael@example.com",
    status: "INACTIVE",
    totalSpent: 459.0,
    totalOrders: 1,
    lastPurchaseAt: "2025-08-21T09:00:00.000Z",
    createdAt: "2025-08-20T09:00:00.000Z",
  },
];
