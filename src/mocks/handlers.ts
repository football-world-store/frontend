import { http, HttpResponse } from "msw";

import { API_BASE_URL } from "@/services/api";
import { alertsFixture } from "./fixtures/alerts";
import { customersFixture } from "./fixtures/customers";
import { dashboardStatsFixture } from "./fixtures/dashboard";
import { productsFixture } from "./fixtures/products";
import { salesFixture } from "./fixtures/sales";
import { stockEntriesFixture } from "./fixtures/stockEntries";
import { usersFixture } from "./fixtures/users";

const rawBase = API_BASE_URL.replace(/\/$/, "");
const baseUrl = rawBase.startsWith("/") ? `*${rawBase}` : rawBase;

const envelope = <T>(data: T) => HttpResponse.json({ data });

const generateId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

// In-memory mutable copies para simular CRUD durante a sessão
const products = [...productsFixture];
const customers = [...customersFixture];
const stockEntries = [...stockEntriesFixture];
const users = [...usersFixture];

export const handlers = [
  // ----- Products
  http.get(`${baseUrl}/products`, () => envelope(products)),
  http.get(`${baseUrl}/products/:id`, ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    return product
      ? envelope(product)
      : HttpResponse.json(
          { message: "Produto não encontrado", statusCode: 404 },
          { status: 404 },
        );
  }),
  http.post(`${baseUrl}/products`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const product = {
      id: generateId("p"),
      internalCode: String(body.internalCode ?? ""),
      name: String(body.name ?? ""),
      clubOrBrand: String(body.clubOrBrand ?? ""),
      category: body.category as never,
      size: String(body.size ?? ""),
      photoUrl: null,
      costPrice: Number(body.costPrice ?? 0),
      salePrice: Number(body.salePrice ?? 0),
      quantity: Number(body.quantity ?? 0),
      minStock: Number(body.minStock ?? 0),
      isActive: true,
      lastSaleAt: null,
      totalSold: 0,
    };
    products.unshift(product);
    return HttpResponse.json({ data: product }, { status: 201 });
  }),

  // ----- Dashboard
  http.get(`${baseUrl}/dashboard/stats`, () => envelope(dashboardStatsFixture)),

  // ----- Stock entries
  http.get(`${baseUrl}/stock-entries`, () => envelope(stockEntries)),
  http.post(`${baseUrl}/stock-entries`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const product = products.find((p) => p.id === body.productId);
    const entry = {
      id: generateId("se"),
      productId: String(body.productId ?? ""),
      productName: product?.name ?? "Produto",
      type: (body.type ?? "ENTRY") as never,
      quantity: Number(body.quantity ?? 0),
      unitCost: Number(body.unitCost ?? 0),
      registeredAt:
        typeof body.registeredAt === "string"
          ? body.registeredAt
          : new Date().toISOString(),
      registeredBy: "Edimilson",
    };
    stockEntries.unshift(entry);
    if (product) {
      product.quantity =
        entry.type === "ENTRY"
          ? product.quantity + entry.quantity
          : Math.max(0, product.quantity - entry.quantity);
    }
    return HttpResponse.json({ data: entry }, { status: 201 });
  }),

  // ----- Sales
  http.get(`${baseUrl}/sales`, () => envelope(salesFixture)),

  // ----- Customers
  http.get(`${baseUrl}/customers`, () => envelope(customers)),
  http.get(`${baseUrl}/customers/:id`, ({ params }) => {
    const customer = customers.find((c) => c.id === params.id);
    return customer
      ? envelope(customer)
      : HttpResponse.json(
          { message: "Cliente não encontrado", statusCode: 404 },
          { status: 404 },
        );
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
    return HttpResponse.json({ data: customer }, { status: 201 });
  }),

  // ----- Alerts
  http.get(`${baseUrl}/alerts`, () => envelope(alertsFixture)),

  // ----- Users (sistema)
  http.get(`${baseUrl}/users`, () => envelope(users)),
  http.post(`${baseUrl}/users`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const user = {
      id: generateId("u"),
      name: String(body.name ?? ""),
      email: String(body.email ?? ""),
      role: (body.role ?? "EMPLOYEE") as never,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
    };
    users.unshift(user);
    return HttpResponse.json({ data: user }, { status: 201 });
  }),
];
