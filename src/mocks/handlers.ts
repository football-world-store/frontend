import { http, HttpResponse } from "msw";

import { ENV } from "@/constants";
import type { PaginatedResult } from "@/types";

import { alertsFixture } from "./fixtures/alerts";
import { customersFixture } from "./fixtures/customers";
import { dashboardSummaryFixture } from "./fixtures/dashboard";
import { productsFixture } from "./fixtures/products";
import { salesFixture } from "./fixtures/sales";
import { stockEntriesFixture } from "./fixtures/stockEntries";
import { usersFixture } from "./fixtures/users";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const HTTP_CREATED = 201;
const HTTP_NOT_FOUND = 404;

const rawBase = ENV.API_URL.replace(/\/$/, "");
const baseUrl = rawBase.startsWith("/") ? `*${rawBase}` : rawBase;

const envelope = <T>(data: T) => HttpResponse.json({ data });

const notFound = (message: string) =>
  HttpResponse.json(
    { message, statusCode: HTTP_NOT_FOUND },
    { status: HTTP_NOT_FOUND },
  );

const paginate = <T>(items: T[]): PaginatedResult<T> => ({
  items,
  page: DEFAULT_PAGE,
  limit: DEFAULT_LIMIT,
  total: items.length,
});

const generateId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

const products = [...productsFixture];
const customers = [...customersFixture];
const stockEntries = [...stockEntriesFixture];
const users = [...usersFixture];

export const handlers = [
  // ----- Products
  http.get(`${baseUrl}/products`, () => envelope(paginate(products))),
  http.post(`${baseUrl}/products/find`, async ({ request }) => {
    const body = (await request.json()) as { id?: string };
    const product = products.find((p) => p.id === body.id);
    return product ? envelope(product) : notFound("Produto não encontrado");
  }),
  http.post(`${baseUrl}/products`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const initialQuantity = Number(body.initialQuantity ?? 0);
    const product = {
      id: generateId("p"),
      internalCode: `FWS-${String(products.length + 1).padStart(4, "0")}`,
      name: String(body.name ?? ""),
      clubOrBrand: String(body.clubOrBrand ?? ""),
      category: body.category as never,
      size: String(body.size ?? ""),
      photoUrl: null,
      costPrice: Number(body.costPrice ?? 0),
      salePrice: Number(body.salePrice ?? 0),
      quantity: initialQuantity,
      minStock: Number(body.minStock ?? 0),
      isActive: true,
      lastSaleAt: null,
      totalSold: 0,
      status: "IN_STOCK" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.unshift(product);
    return HttpResponse.json({ data: product }, { status: HTTP_CREATED });
  }),

  // ----- Dashboard
  http.get(`${baseUrl}/dashboard/summary`, () =>
    envelope(dashboardSummaryFixture),
  ),
  http.get(`${baseUrl}/dashboard/top-products`, () => envelope([])),
  http.get(`${baseUrl}/dashboard/top-clubs`, () => envelope([])),
  http.get(`${baseUrl}/dashboard/sizes`, () =>
    envelope({ top5: [], bottom5: [] }),
  ),
  http.get(`${baseUrl}/dashboard/channels`, () => envelope([])),
  http.get(`${baseUrl}/dashboard/margins`, () =>
    envelope({
      overall: { revenue: 0, cost: 0, grossProfit: 0, marginPercentage: 0 },
      byProduct: [],
    }),
  ),
  http.get(`${baseUrl}/dashboard/idle-products`, () => envelope([])),
  http.get(`${baseUrl}/dashboard/payment-methods`, () => envelope([])),
  http.get(`${baseUrl}/dashboard/stock-velocity`, () => envelope([])),
  http.get(`${baseUrl}/dashboard/reorder-list`, () => envelope([])),
  http.get(`${baseUrl}/dashboard/capital-by-club`, () => envelope([])),
  http.get(`${baseUrl}/alerts/count`, () =>
    envelope({ total: 0, critical: 0, informational: 0 }),
  ),

  // ----- Stock entries
  http.get(`${baseUrl}/stock-entries`, () => envelope(paginate(stockEntries))),
  http.post(`${baseUrl}/stock-entries/find`, async ({ request }) => {
    const body = (await request.json()) as { id?: string };
    const entry = stockEntries.find((e) => e.id === body.id);
    return entry ? envelope(entry) : notFound("Movimentação não encontrada");
  }),
  http.post(`${baseUrl}/stock-entries`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const product = products.find((p) => p.id === body.productId);
    const entry = {
      id: generateId("se"),
      productId: String(body.productId ?? ""),
      productName: product?.name ?? "Produto",
      movementType: "ENTRY" as const,
      quantity: Number(body.quantity ?? 0),
      unitCost: Number(body.unitCost ?? 0),
      supplier: String(body.supplier ?? ""),
      notes: typeof body.notes === "string" ? body.notes : null,
      reversedEntryId: null,
      userId: "u-001",
      userName: "Edimilson Junior",
      entryDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    stockEntries.unshift(entry);
    if (product) {
      product.quantity += entry.quantity;
    }
    return HttpResponse.json({ data: entry }, { status: HTTP_CREATED });
  }),

  // ----- Sales
  http.get(`${baseUrl}/sales`, () => envelope(paginate(salesFixture))),

  // ----- Customers (mock-only por enquanto)
  http.get(`${baseUrl}/customers`, () => envelope(customers)),
  http.get(`${baseUrl}/customers/:id`, ({ params }) => {
    const customer = customers.find((c) => c.id === params.id);
    return customer ? envelope(customer) : notFound("Cliente não encontrado");
  }),
  http.post(`${baseUrl}/customers`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const customer = {
      id: generateId("c"),
      name: String(body.name ?? ""),
      phone: (body.phone as string | null) ?? null,
      email: (body.email as string | null) ?? null,
      status: "ACTIVE" as const,
      totalSpent: 0,
      totalOrders: 0,
      lastPurchaseAt: null,
      createdAt: new Date().toISOString(),
    };
    customers.unshift(customer);
    return HttpResponse.json({ data: customer }, { status: HTTP_CREATED });
  }),

  // ----- Alerts (mock-only por enquanto)
  http.get(`${baseUrl}/alerts`, () => envelope(alertsFixture)),

  // ----- Users
  http.get(`${baseUrl}/users`, () => envelope(paginate(users))),
  http.get(`${baseUrl}/users/me`, () =>
    envelope({
      id: "u-001",
      name: "Edimilson Junior",
      email: "dono@footballworld.com",
      role: "OWNER" as const,
    }),
  ),
  http.post(`${baseUrl}/users`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const user = {
      id: generateId("u"),
      name: String(body.name ?? ""),
      email: String(body.email ?? ""),
      role: (body.role ?? "EMPLOYEE") as never,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.unshift(user);
    return HttpResponse.json({ data: user }, { status: HTTP_CREATED });
  }),
];
