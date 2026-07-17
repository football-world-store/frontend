export interface CustomerFixture {
  id: string;
  name: string;
  whatsapp: string | null;
  email: string | null;
  status: "ACTIVE" | "COOLING" | "INACTIVE";
  favoriteTeam: string | null;
  preferredSizes: string[];
  birthDate: string | null;
  notes: string | null;
  totalSpent: number;
  totalOrders: number;
  lastPurchaseAt: string | null;
  createdAt: string;
}

export const customersFixture: CustomerFixture[] = [
  {
    id: "c-001",
    name: "Lucas Andrade",
    whatsapp: "5511999991111",
    email: "lucas@example.com",
    status: "ACTIVE",
    favoriteTeam: "Flamengo",
    preferredSizes: ["M", "G"],
    birthDate: "1990-05-20",
    notes: null,
    totalSpent: 2890.4,
    totalOrders: 12,
    lastPurchaseAt: "2026-04-23T13:00:00.000Z",
    createdAt: "2025-09-12T10:00:00.000Z",
  },
  {
    id: "c-002",
    name: "Carolina Mendes",
    whatsapp: "5511988882222",
    email: "carolina@example.com",
    status: "COOLING",
    favoriteTeam: "Corinthians",
    preferredSizes: ["P"],
    birthDate: null,
    notes: "Prefere ser contatada à noite",
    totalSpent: 1290.0,
    totalOrders: 5,
    lastPurchaseAt: "2026-02-08T18:00:00.000Z",
    createdAt: "2024-11-04T11:00:00.000Z",
  },
  {
    id: "c-003",
    name: "Rafael Souza",
    whatsapp: null,
    email: "rafael@example.com",
    status: "INACTIVE",
    favoriteTeam: null,
    preferredSizes: [],
    birthDate: null,
    notes: null,
    totalSpent: 459.0,
    totalOrders: 1,
    lastPurchaseAt: "2025-08-21T09:00:00.000Z",
    createdAt: "2025-08-20T09:00:00.000Z",
  },
];
